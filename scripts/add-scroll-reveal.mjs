// Makes each date in the timeline animate in as you scroll to it.
// Edits src/App.js and adds styles to src/index.css. Run from the repo root:
//   node scripts/add-scroll-reveal.mjs
import { readFileSync, writeFileSync } from 'node:fs';

const APP = 'src/App.js';
const CSS = 'src/index.css';
let app = readFileSync(APP, 'utf8');

if (app.includes('const Reveal =')) {
  console.log('Scroll animation already added; nothing changed.');
  process.exit(0);
}
const fail = (msg) => { console.error(`${msg} Nothing changed.`); process.exit(1); };

// 1. Make sure useEffect and useRef are imported.
app = app.replace(/import React, \{([^}]*)\} from 'react';/, (_, names) => {
  const list = names.split(',').map((s) => s.trim()).filter(Boolean);
  for (const n of ['useEffect', 'useRef']) if (!list.includes(n)) list.push(n);
  return `import React, { ${list.join(', ')} } from 'react';`;
});
if (!app.includes('useRef')) fail('Could not find the React import line.');

// 2. Add the Reveal component just above the main component.
const reveal = `// Wraps a timeline date group and marks it visible once it scrolls into view.
const Reveal = ({ children }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) { setVisible(true); return; }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); observer.disconnect(); }
    }, { rootMargin: '0px 0px -15% 0px' });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return <div ref={ref} className={'reveal-group' + (visible ? ' is-visible' : '')}>{children}</div>;
};

`;
const mainAt = app.indexOf('const CourtCaseTimeline');
if (mainAt === -1) fail('Could not find the CourtCaseTimeline component.');
app = app.slice(0, mainAt) + reveal + app.slice(mainAt);

// 3. Wrap each date group in <Reveal>.
const open = app.match(/\{sortedDates\.map\(\(date\) => \(\n([ \t]*)<div key=\{date\}>/);
if (!open) fail('Could not find the date groups.');
const indent = open[1];
const openAt = open.index + open[0].length - '<div key={date}>'.length;
app = app.slice(0, openAt) + '<Reveal key={date}>' + app.slice(openAt + '<div key={date}>'.length);
const closeRe = new RegExp(`\\n${indent}</div>\\n[ \\t]*\\)\\)\\}`, 'g');
closeRe.lastIndex = openAt;
const close = closeRe.exec(app);
if (!close) fail('Could not find the end of the date groups.');
const closeAt = close.index + 1 + indent.length;
app = app.slice(0, closeAt) + '</Reveal>' + app.slice(closeAt + '</div>'.length);

// 4. Styles: the date header slides in, then the cards rise in one after another.
let css = readFileSync(CSS, 'utf8');
const delays = Array.from({ length: 8 }, (_, i) =>
  `.reveal-group.is-visible .grid > :nth-child(${i + 2}) { animation-delay: ${((i + 1) * 0.07 + 0.15).toFixed(2)}s; }`).join('\n');
css += `
/* Scroll reveal for timeline date groups */
.reveal-group:not(.is-visible) > :first-child,
.reveal-group:not(.is-visible) .grid > * { opacity: 0; }
.reveal-group.is-visible > :first-child { animation: reveal-date 0.5s ease-out both; }
.reveal-group.is-visible .grid > * { animation: reveal-card 0.55s ease-out 0.15s both; }
${delays}
.reveal-group.is-visible .grid > :nth-child(n+10) { animation-delay: 0.8s; }
@keyframes reveal-date { from { opacity: 0; transform: translateX(-24px) scale(0.96); } to { opacity: 1; transform: none; } }
@keyframes reveal-card { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: none; } }
@media (prefers-reduced-motion: reduce) {
  .reveal-group > :first-child, .reveal-group .grid > * { opacity: 1 !important; animation: none !important; }
}
`;

writeFileSync(APP, app);
writeFileSync(CSS, css);
console.log('Added the scroll animation to src/App.js and src/index.css');
