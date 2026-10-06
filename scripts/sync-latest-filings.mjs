// Updates each case's `latestFiling` in src/data/cases.json from CourtListener.
// Built for a limit of 5 requests/minute, 50/hour and 125/day. It paces itself,
// stops at its per-run budget, and saves progress so the next run picks up
// where this one left off. Run from the repo root:
//   COURTLISTENER_TOKEN=yourtoken node scripts/sync-latest-filings.mjs
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const DATA_PATH = 'src/data/cases.json';
const STATE_PATH = 'scripts/sync-state.json'; // bookkeeping; not used by the site
const API = 'https://www.courtlistener.com/api/rest/v4';
const SITE = 'https://www.courtlistener.com';
const MAX_REQUESTS = Number(process.env.MAX_REQUESTS || 40); // per run; account allows 50/hour
const DELAY_MS = Number(process.env.SYNC_DELAY_MS ?? 13000); // account allows 5 requests/minute
const RECHECK_HOURS = 44; // check each case about every two days (account allows 125 requests/day)

const TOKEN = process.env.COURTLISTENER_TOKEN;
if (!TOKEN) {
  console.error('Set COURTLISTENER_TOKEN');
  process.exit(1);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const now = new Date();
const today = now.toISOString().slice(0, 10);
const hoursSince = (iso) => (now - new Date(iso)) / 3.6e6;

class OutOfRequests extends Error {}
let requestCount = 0;

async function api(path, params) {
  if (requestCount >= MAX_REQUESTS) throw new OutOfRequests(`used this run's ${MAX_REQUESTS} requests`);
  requestCount++;
  const url = `${API}/${path}/?${new URLSearchParams(params)}`;
  const res = await fetch(url, { headers: { Authorization: `Token ${TOKEN}` } });
  if (res.status === 429) throw new OutOfRequests('CourtListener rate limit reached');
  if (!res.ok) throw new Error(`${res.status} on ${url}`);
  const body = await res.json();
  await sleep(DELAY_MS);
  return body;
}

// --- Name matching -------------------------------------------------------
const norm = (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

function nameParts(name) {
  const tokens = norm(name).replace(/[.,]/g, '').split(/\s+/)
    .filter((t) => !['jr', 'sr', 'ii', 'iii'].includes(t));
  return { first: tokens[0], last: tokens[tokens.length - 1] };
}

// An entry counts for a defendant if it doesn't name any defendant (case-level),
// or if it names this one. If two tracked defendants on the docket share a last
// name, the first name has to match too.
function isAbout(text, c, coDefendants) {
  const t = norm(text);
  if (!/\bdefendants?\b/.test(t)) return true;
  const { first, last } = nameParts(c.defendant);
  if (!t.includes(last)) return false;
  const shared = coDefendants.some((o) => nameParts(o.defendant).last === last);
  return shared ? t.includes(first) : true;
}

function clean(text) {
  let t = text
    .replace(/\(Entered: [^)]*\)/gi, '')
    .replace(/THERE IS NO PDF DOCUMENT ASSOCIATED WITH THIS ENTRY\.?/gi, '')
    .replace(/\bTEXT ONLY ENTRY\b/g, '')
    .replace(/\((?:[a-z]{2,4})\)/g, '') // clerk initials like (yl)
    .replace(/\s+/g, ' ')
    .trim();
  if (t.length > 280) t = t.slice(0, 280).replace(/\s+\S*$/, '') + '…';
  return t;
}

// --- Load ------------------------------------------------------------------
const cases = JSON.parse(readFileSync(DATA_PATH, 'utf8'));
const before = JSON.stringify(cases);
const state = existsSync(STATE_PATH)
  ? JSON.parse(readFileSync(STATE_PATH, 'utf8'))
  : { groups: {}, notFound: {} };
const failures = [];
let stoppedEarly = null;
let groupsChecked = 0;

try {
  // Step 1 (mostly a one-time cost): turn each PACER ID from a source link
  // into a case number, and save it so later runs skip this.
  const resolved = new Map();
  for (const c of cases) {
    if (!c.courtId || c.docketNumber || !c.pacerCaseId) continue;
    const key = `${c.courtId}|${c.pacerCaseId}`;
    if (state.notFound[key] && hoursSince(state.notFound[key]) < 24 * 7) continue;
    if (!resolved.has(key)) {
      const { results } = await api('dockets', {
        court: c.courtId, pacer_case_id: c.pacerCaseId, fields: 'docket_number',
      });
      resolved.set(key, results[0]?.docket_number ?? null);
    }
    const dn = resolved.get(key);
    if (dn) c.docketNumber = dn;
    else {
      state.notFound[key] = now.toISOString();
      failures.push(`#${c.id} ${c.defendant}: no CourtListener docket for PACER ID ${c.pacerCaseId}`);
    }
  }

  // Step 2: group defendants by case number, least recently checked first.
  const groups = new Map();
  for (const c of cases) {
    if (!c.courtId || !c.docketNumber) continue;
    const key = `${c.courtId}|${c.docketNumber}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(c);
  }
  const due = [...groups.keys()]
    .filter((k) => !state.groups[k] || hoursSince(state.groups[k].checkedAt) >= RECHECK_HOURS)
    .sort((a, b) => (state.groups[a]?.checkedAt ?? '').localeCompare(state.groups[b]?.checkedAt ?? ''));

  for (const key of due) {
    const members = groups.get(key);
    const [court, docketNumber] = key.split('|');
    try {
      // CourtListener keeps one docket per defendant plus a case-level one.
      const { results: dockets } = await api('dockets', {
        court, docket_number: docketNumber, fields: 'id,absolute_url,date_last_filing',
      });
      const lastFiling = dockets.map((d) => d.date_last_filing ?? '').sort().pop() || null;

      // Nothing new since last time: just mark it checked.
      if (state.groups[key] && state.groups[key].lastFiling === lastFiling) {
        for (const c of members) if (c.latestFiling) c.latestFiling.checked = today;
        state.groups[key].checkedAt = now.toISOString();
        groupsChecked++;
        continue;
      }

      // Merge entries across the dockets; the same entry can be blank on one
      // and complete on another.
      const byNumber = new Map();
      const unnumbered = [];
      for (const d of dockets) {
        const { results } = await api('docket-entries', {
          docket: d.id, order_by: '-date_filed', fields: 'entry_number,date_filed,description',
        });
        for (const e of results) {
          if (!e.description?.trim()) continue;
          const entry = { ...e, docketUrl: SITE + d.absolute_url };
          if (e.entry_number == null) { unnumbered.push(entry); continue; }
          const prev = byNumber.get(e.entry_number);
          if (!prev || e.description.length > prev.description.length) byNumber.set(e.entry_number, entry);
        }
      }
      const entries = [...byNumber.values(), ...unnumbered];

      for (const c of members) {
        const coDefendants = members.filter((o) => o !== c);
        const latest = entries
          .filter((e) => isAbout(e.description, c, coDefendants))
          .sort((a, b) =>
            b.date_filed.localeCompare(a.date_filed) ||
            (b.entry_number ?? 0) - (a.entry_number ?? 0))[0];
        if (latest) {
          c.latestFiling = {
            date: latest.date_filed,
            entryNumber: latest.entry_number,
            text: clean(latest.description),
            docketUrl: latest.docketUrl,
            checked: today,
          };
        }
      }
      state.groups[key] = { checkedAt: now.toISOString(), lastFiling };
      groupsChecked++;
    } catch (err) {
      if (err instanceof OutOfRequests) throw err;
      failures.push(`${docketNumber} (${members.map((m) => m.defendant).join(', ')}): ${err.message}`);
    }
  }
} catch (err) {
  if (!(err instanceof OutOfRequests)) throw err;
  stoppedEarly = err.message;
}

// --- Report and save -----------------------------------------------------------
const total = new Set(cases.filter((c) => c.docketNumber).map((c) => `${c.courtId}|${c.docketNumber}`)).size;
const upToDate = Object.values(state.groups).filter((g) => hoursSince(g.checkedAt) < RECHECK_HOURS).length;
console.log(`Requests used this run: ${requestCount}`);
console.log(`Case numbers checked this run: ${groupsChecked}`);
console.log(`Case numbers checked in the last ${RECHECK_HOURS} hours: ${upToDate} of ${total}`);
console.log(`Cases with a latest filing: ${cases.filter((c) => c.latestFiling).length} of ${cases.length}`);
if (stoppedEarly) console.log(`Stopped early (${stoppedEarly}). Progress is saved; run again in an hour to continue (up to three runs a day).`);
if (failures.length) {
  console.log(`Problems (${failures.length}):`);
  for (const f of failures) console.log(`  ${f}`);
}

writeFileSync(STATE_PATH, JSON.stringify(state, null, 2) + '\n');
if (JSON.stringify(cases) !== before) {
  writeFileSync(DATA_PATH, JSON.stringify(cases, null, 2) + '\n');
  console.log('Saved changes to cases.json');
}
if (groupsChecked === 0 && failures.length > 0 && !stoppedEarly) process.exit(1);
