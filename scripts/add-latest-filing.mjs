// Adds the "Latest filing on CourtListener" section to the expanded cards in src/App.js.
// Run from the repo root:  node scripts/add-latest-filing.mjs
import { readFileSync, writeFileSync } from 'node:fs';

const PATH = 'src/App.js';
let src = readFileSync(PATH, 'utf8');
if (src.includes('Latest filing on CourtListener')) {
  console.log('Already added; nothing changed.');
  process.exit(0);
}
const anchor = "{caseItem.source && caseItem.source !== 'n/a' && (";
const at = src.indexOf(anchor);
if (at === -1) { console.error('Could not find the spot to insert; nothing changed.'); process.exit(1); }
const indent = src.slice(src.lastIndexOf('\n', at) + 1, at);

const block = `{caseItem.latestFiling && (
  <div>
    <h4 className="font-semibold text-slate-700 mb-1 text-sm">Latest filing on CourtListener</h4>
    <p className="text-slate-500 text-xs mb-1">
      Filed {formatDate(caseItem.latestFiling.date)}
      {caseItem.latestFiling.checked && <> · checked {formatDate(caseItem.latestFiling.checked)}</>}
    </p>
    <p className="text-slate-600 text-sm">{caseItem.latestFiling.text}</p>
    <a
      href={caseItem.latestFiling.docketUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1 mt-1"
    >
      <ExternalLink className="w-3 h-3" />
      View docket on CourtListener
    </a>
  </div>
)}
`.split('\n').map((l, i) => (i === 0 || !l ? l : indent + l)).join('\n');

src = src.slice(0, at) + block + indent + src.slice(at);
writeFileSync(PATH, src);
console.log('Added the latest filing section to src/App.js');
