// 1. Removes the "Plea" section from the expanded cards.
// 2. Stops cards in the same row from stretching when one card is expanded.
// Run from the repo root:  node scripts/cards-cleanup.mjs
import { readFileSync, writeFileSync } from 'node:fs';

const APP = 'src/App.js';
let app = readFileSync(APP, 'utf8');
const done = [];

const plea = /\n[ \t]*\{caseItem\.plea && caseItem\.plea !== 'n\/a' && \([\s\S]*?>Plea<\/h4>[\s\S]*?\n[ \t]*\)\}/;
if (plea.test(app)) { app = app.replace(plea, ''); done.push('Removed the Plea section'); }

const grid = 'className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"';
if (app.includes(grid)) {
  app = app.replace(grid, 'className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start"');
  done.push('Cards now expand on their own');
}

if (!done.length) { console.log('Nothing to change; already done.'); process.exit(0); }
writeFileSync(APP, app);
for (const d of done) console.log(d);
