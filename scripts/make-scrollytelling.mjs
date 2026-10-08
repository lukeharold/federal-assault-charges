// Replaces the one-time reveal with scroll-linked fading: each date and case card
// fades in as it enters the screen and fades out as it leaves, in either direction.
// Run from the repo root (after add-scroll-reveal.mjs):  node scripts/make-scrollytelling.mjs
import { readFileSync, writeFileSync } from 'node:fs';

const APP = 'src/App.js';
const CSS = 'src/index.css';
let app = readFileSync(APP, 'utf8');
let css = readFileSync(CSS, 'utf8');
const fail = (msg) => { console.error(`${msg} Nothing changed.`); process.exit(1); };

if (app.includes('useScrollFade')) { console.log('Already converted; nothing changed.'); process.exit(0); }

// 1. Swap the old Reveal component for a plain wrapper plus a scroll-tracking hook.
const start = app.indexOf('// Wraps a timeline date group');
const end = app.indexOf('const CourtCaseTimeline');
if (start === -1 || end === -1 || end < start) fail('Could not find the old Reveal component.');
const replacement = `// Groups one date's header and cards.
const Reveal = ({ children }) => <div className="reveal-group">{children}</div>;

// Fades each date header and case card in and out as it moves through the screen.
// Scrolling down, items rise in from the bottom and drift up and away at the top;
// scrolling up reverses it.
const FADE_ZONE = 0.22; // share of the screen height at the top and bottom where fading happens
const DRIFT_PX = 40; // how far items move while fading
const useScrollFade = () => {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let frame = null;
    const update = () => {
      frame = null;
      const h = window.innerHeight;
      const zone = h * FADE_ZONE;
      document.querySelectorAll('.reveal-group > :first-child, .reveal-group .grid > *').forEach((el) => {
        const r = el.getBoundingClientRect();
        const enter = Math.min(1, Math.max(0, (h - r.top) / zone));
        const exit = Math.min(1, Math.max(0, r.bottom / zone));
        const v = Math.min(enter, exit);
        el.style.opacity = v.toFixed(3);
        el.style.transform = v >= 1 ? '' : \`translateY(\${((1 - v) * DRIFT_PX * (enter < exit ? 1 : -1)).toFixed(1)}px)\`;
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
app = app.slice(0, start) + replacement + app.slice(end);

// 2. Turn it on inside the main component.
app = app.replace(/const CourtCaseTimeline = \(\) => \{\n/, (m) => `${m}  useScrollFade();\n`);
if (!app.includes('  useScrollFade();')) fail('Could not find where the main component starts.');

// 3. useRef is no longer used; remove it so the build doesn't warn.
app = app.replace(/import React, \{([^}]*)\} from 'react';/, (_, names) =>
  `import React, { ${names.split(',').map((s) => s.trim()).filter((n) => n && n !== 'useRef').join(', ')} } from 'react';`);

// 4. Remove the old one-time animation styles and smooth the scroll-linked motion.
const cssStart = css.indexOf('/* Scroll reveal for timeline date groups */');
if (cssStart !== -1) {
  const tail = css.slice(cssStart);
  const m = tail.match(/@media \(prefers-reduced-motion: reduce\) \{[\s\S]*?\n\}\n?/);
  css = css.slice(0, cssStart).replace(/\n+$/, '\n') + (m ? tail.slice(m.index + m[0].length) : '');
}
css += `
/* Scroll-linked fading for timeline date groups */
.reveal-group > :first-child,
.reveal-group .grid > * { will-change: opacity, transform; }
`;

writeFileSync(APP, app);
writeFileSync(CSS, css);
console.log('Converted the timeline to scroll-linked fading.');
