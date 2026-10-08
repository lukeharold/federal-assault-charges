// Keeps each date pinned to the top of the screen while you scroll through its cases,
// until the next date pushes it away (works scrolling up too).
// Run from the repo root (after make-scrollytelling.mjs):  node scripts/add-sticky-dates.mjs
import { readFileSync, writeFileSync } from 'node:fs';

const APP = 'src/App.js';
const CSS = 'src/index.css';
let app = readFileSync(APP, 'utf8');
let css = readFileSync(CSS, 'utf8');
const fail = (msg) => { console.error(`${msg} Nothing changed.`); process.exit(1); };

if (css.includes('Sticky date headers')) { console.log('Already added; nothing changed.'); process.exit(0); }

const start = app.indexOf('// Fades each date header and case card');
const end = app.indexOf('const CourtCaseTimeline');
if (start === -1 || end < start) fail('Could not find the scroll fade code. Run make-scrollytelling.mjs first.');

const hook = `// Fades case cards in and out as they move through the screen, and fades each date
// in as it arrives. Dates then stay pinned at the top (see index.css) until the next
// date pushes them away. Scrolling up reverses everything.
const FADE_ZONE = 0.22; // share of the screen height where fading happens
const DRIFT_PX = 40; // how far items move while fading
const useScrollFade = () => {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let frame = null;
    const setFade = (el, v, direction) => {
      el.style.opacity = v.toFixed(3);
      el.style.transform = v >= 1 ? '' : \`translateY(\${((1 - v) * DRIFT_PX * direction).toFixed(1)}px)\`;
    };
    const update = () => {
      frame = null;
      const h = window.innerHeight;
      const zone = h * FADE_ZONE;
      // Cards fade out as they slide under the pinned date, not at the very top.
      const pinned = document.querySelector('.reveal-group > :first-child');
      const top = pinned ? pinned.offsetHeight : 0;
      document.querySelectorAll('.reveal-group > :first-child').forEach((el) => {
        const r = el.getBoundingClientRect();
        setFade(el, Math.min(1, Math.max(0, (h - r.top) / zone)), 1);
      });
      document.querySelectorAll('.reveal-group .grid > *').forEach((el) => {
        const r = el.getBoundingClientRect();
        const enter = Math.min(1, Math.max(0, (h - r.top) / zone));
        const exit = Math.min(1, Math.max(0, (r.bottom - top) / zone));
        setFade(el, Math.min(enter, exit), enter < exit ? 1 : -1);
      });
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }); // runs after every render, so filtered and expanded cards stay in sync
};

`;
app = app.slice(0, start) + hook + app.slice(end);
// The old version defined these two constants above the hook; drop the duplicates.
app = app.replace(/(const FADE_ZONE[^\n]*\n)([\s\S]*?)const FADE_ZONE[^\n]*\n/, '$1$2');
app = app.replace(/(const DRIFT_PX[^\n]*\n)([\s\S]*?)const DRIFT_PX[^\n]*\n/, '$1$2');

css += `
/* Sticky date headers: each date stays at the top while its cases scroll past */
.reveal-group > :first-child {
  position: sticky;
  top: 0;
  z-index: 10;
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
  background: rgba(241, 245, 249, 0.92);
  -webkit-backdrop-filter: blur(6px);
  backdrop-filter: blur(6px);
}
`;

writeFileSync(APP, app);
writeFileSync(CSS, css);
console.log('Dates now stay pinned while you scroll through their cases.');
