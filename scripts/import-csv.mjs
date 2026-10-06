// Converts the tracker spreadsheet (downloaded as CSV) into src/data/cases.json.
// Keeps each case's existing latestFiling so re-importing doesn't wipe the sync.
// Run from the repo root:  node scripts/import-csv.mjs path/to/sheet.csv
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';

const OUT_PATH = 'src/data/cases.json';
const csvPath = process.argv[2];
if (!csvPath) { console.error('Usage: node scripts/import-csv.mjs path/to/sheet.csv'); process.exit(1); }

function parseCSV(text) {
  const rows = []; let row = [], field = '', q = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (q) {
      if (ch === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (ch === '"') q = false;
      else field += ch;
    } else if (ch === '"') q = true;
    else if (ch === ',') { row.push(field); field = ''; }
    else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && text[i + 1] === '\n') i++;
      row.push(field); rows.push(row); row = []; field = '';
    } else field += ch;
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  return rows.filter((r) => r.some((f) => f.trim()));
}

const COURT_IDS = {
  'central district of california': 'cacd',
  'southern district of california': 'casd',
  'eastern district of california': 'caed',
  'northern district of california': 'cand',
};
const val = (s) => (s && s.trim() ? s.trim() : 'n/a');
const isoDate = (s) => {
  const m = (s || '').trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  return m ? `${m[3]}-${m[1].padStart(2, '0')}-${m[2].padStart(2, '0')}` : val(s);
};
const outcome = (s) => { const t = (s || '').trim().toLowerCase(); return t ? t[0].toUpperCase() + t.slice(1) : 'Pending'; };
// "2:25-cr-00787-JLS" -> "2:25-cr-00787" (drops judge initials and defendant numbers)
const baseCaseNumber = (s) => (s || '').trim().toLowerCase().match(/^\d:\d{2}-[a-z]{2}-\d{5}/)?.[0] ?? null;

const [header, ...rows] = parseCSV(readFileSync(csvPath, 'utf8'));
const col = Object.fromEntries(header.map((h, i) => [h.trim(), i]));
const existing = existsSync(OUT_PATH) ? JSON.parse(readFileSync(OUT_PATH, 'utf8')) : [];
const oldFiling = new Map(existing.map((c) => [`${c.defendant}|${c.docketNumber}`, c.latestFiling]));

const problems = [];
const cases = rows.map((r, i) => {
  const get = (name) => r[col[name]] ?? '';
  const c = {
    id: i + 1,
    date: isoDate(get('date')),
    defendant: get('defendant').trim(),
    location: val(get('location')),
    address: 'n/a',
    charge: val(get('charge')),
    chargeType: val(get('felony_misdemeanor')),
    description: val(get('description')),
    outcome: outcome(get('status')),
    plea: val(get('plea')),
    court: val(get('court')),
    details: val(get('details')),
    source: val(get('source')),
    caseNumber: get('case_no').trim() || null,
    courtId: COURT_IDS[get('court').trim().toLowerCase()] ?? null,
    docketNumber: baseCaseNumber(get('case_no')),
  };
  c.latestFiling = oldFiling.get(`${c.defendant}|${c.docketNumber}`) ?? null;
  if (!c.courtId) problems.push(`Row ${i + 2} (${c.defendant}): unrecognized court "${get('court')}"`);
  if (!c.docketNumber) problems.push(`Row ${i + 2} (${c.defendant}): can't read case number "${get('case_no')}"`);
  if (c.defendant.split(/\s+/).length > 5) problems.push(`Row ${i + 2}: defendant field looks wrong: "${c.defendant.slice(0, 60)}…"`);
  return c;
});

mkdirSync('src/data', { recursive: true });
writeFileSync(OUT_PATH, JSON.stringify(cases, null, 2) + '\n');
console.log(`Wrote ${cases.length} cases to ${OUT_PATH}`);
if (problems.length) { console.log(`Check these (${problems.length}):`); for (const p of problems) console.log(`  ${p}`); }
