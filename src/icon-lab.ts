import { renderIcon } from './lib/renderIcon';
import type { IconName, IconStyle, IconTone } from './types/icon';
import './styles/tokens.css';
import './styles/base.css';
import './styles/icon-lab.css';

const iconNames: IconName[] = [
  'note',
  'linkedin',
  'x',
  'instagram',
  'facebook',
  'github',
  'globe',
  'section',
  'link',
];

const tones: IconTone[] = ['default', 'muted', 'emphasis'];
const styles: IconStyle[] = ['solid', 'outline'];

const root = document.querySelector<HTMLElement>('#icon-lab');

if (!root) {
  throw new Error('Icon lab root not found');
}

root.innerHTML = `
  <main class="icon-lab-shell">
    <header class="icon-lab-header">
      <p class="icon-lab-kicker">QUALITY GATE</p>
      <h1>Icon Lab</h1>
      <p>All icons rendered under identical geometry and tone/style states.</p>
    </header>
    <section class="icon-lab-grid" id="icon-grid"></section>
  </main>
`;

const iconGrid = root.querySelector<HTMLElement>('#icon-grid');
if (!iconGrid) {
  throw new Error('Icon grid not found');
}

iconNames.forEach((iconName) => {
  const card = document.createElement('article');
  card.className = 'icon-lab-card';

  const samples = tones
    .flatMap((tone) => styles.map((style) => ({ tone, style })))
    .map(
      ({ tone, style }) => `
        <div class="icon-lab-sample">
          <span class="icon-lab-wrap icon-lab-wrap--tone-${tone} icon-lab-wrap--style-${style}">
            ${renderIcon({ name: iconName, tone, style, size: 22 })}
          </span>
          <span class="icon-lab-label">${tone} / ${style}</span>
        </div>
      `,
    )
    .join('');

  card.innerHTML = `
    <h2>${iconName}</h2>
    <div class="icon-lab-samples">${samples}</div>
  `;

  iconGrid.appendChild(card);
});
