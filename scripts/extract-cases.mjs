// One-time migration: pulls the hardcoded `cases` array out of App.js into
// src/data/cases.json and seeds CourtListener fields from each source URL.
// Run from the repo root:  node scripts/extract-cases.mjs
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const APP_PATH = 'src/App.js';
const OUT_PATH = 'src/data/cases.json';

// Cases whose sources are on DocumentCloud, so there's no PACER ID in the URL.
// Filled in where we've already looked them up; the rest need a manual lookup.
const OVERRIDES = {
  1: { court: 'cacd', docketNumber: '2:25-cr-00787' }, // Alfaro
  2: { court: 'cacd', docketNumber: '5:25-cr-00310' }, // Blandon-Saavedra
  3: { court: 'cacd', docketNumber: '2:25-cr-00765' }, // Rivera
  4: { court: 'cacd', docketNumber: '2:25-cr-00765' }, // Rodriguez
};

const src = readFileSync(APP_PATH, 'utf8');
const match = src.match(/const cases = (\[[\s\S]*?\]);\n/);
if (!match) throw new Error('Could not find the cases array in App.js');
const cases = JSON.parse(match[1]);

const out = cases.map((c) => {
  const m = c.source.match(/gov\.uscourts\.([a-z]+)\.(\d+)/);
  return {
    ...c,
    court: m ? m[1] : null,
    pacerCaseId: m ? m[2] : null, // seed only: may be a co-defendant's or lead docket
    docketNumber: null,
    ...OVERRIDES[c.id],
    latestFiling: null, // written by the sync script
    needsReview: false,
  };
});

mkdirSync('src/data', { recursive: true });
writeFileSync(OUT_PATH, JSON.stringify(out, null, 2) + '\n');

const unmapped = out.filter((c) => !c.pacerCaseId && !c.docketNumber);
console.log(`Wrote ${out.length} cases to ${OUT_PATH}`);
console.log(`Need manual docket lookup (${unmapped.length}):`);
for (const c of unmapped) console.log(`  #${c.id} ${c.defendant}`);
