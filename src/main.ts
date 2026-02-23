import { renderLinks } from './components/renderLinks';
import { renderProfile } from './components/renderProfile';
import { renderQr } from './components/renderQr';
import { LINKS_CONFIG } from './data/links.config';
import { PROFILE_CONFIG } from './data/profile.config';
import { normalizeLinks } from './lib/normalizeLinks';
import { resolveQrUrl } from './lib/resolveQrUrl';
import './styles/tokens.css';
import './styles/base.css';
import './styles/components.css';

const appElement = document.querySelector<HTMLElement>('#app');

if (!appElement) {
  throw new Error('Root #app element not found');
}

appElement.innerHTML = `
  <div class="page-shell">
    <div class="layout-rail">
      <div class="layout-content">
        <header class="profile-card" id="profile"></header>

        <main class="layout-main" aria-label="Bio links content">
          <section class="panel panel--personal" aria-labelledby="personal-title">
            <h2 id="personal-title" class="panel-title">Personal</h2>
            <div id="personal-links" class="links-stack"></div>
          </section>

          <section class="panel panel--corporate" aria-labelledby="corporate-title">
            <h2 id="corporate-title" class="panel-title">Professional</h2>
            <div id="corporate-links" class="links-stack"></div>
          </section>
        </main>
      </div>

      <aside id="qr-desktop" class="qr-dock" aria-label="QR code dock"></aside>
    </div>
  </div>
`;

const profileElement = appElement.querySelector<HTMLElement>('#profile');
const personalLinksElement = appElement.querySelector<HTMLElement>('#personal-links');
const corporateLinksElement = appElement.querySelector<HTMLElement>('#corporate-links');
const qrElement = appElement.querySelector<HTMLElement>('#qr-desktop');

if (!profileElement || !personalLinksElement || !corporateLinksElement || !qrElement) {
  throw new Error('Failed to initialize page layout elements');
}

const normalizedLinks = normalizeLinks(LINKS_CONFIG);

renderProfile(profileElement, PROFILE_CONFIG);
renderLinks(normalizedLinks, {
  personalContainer: personalLinksElement,
  corporateContainer: corporateLinksElement,
});

function syncQrDockPosition(): void {
  if (window.matchMedia('(max-width: 1000px)').matches) {
    qrElement!.style.removeProperty('--qr-sticky-top');
    return;
  }

  const appPaddingBottom = Number.parseFloat(getComputedStyle(appElement!).paddingBottom) || 56;
  const dockHeight = qrElement!.getBoundingClientRect().height;
  const viewportHeight = window.innerHeight;
  const topOffset = Math.max(24, viewportHeight - dockHeight - appPaddingBottom);

  qrElement!.style.setProperty('--qr-sticky-top', `${Math.round(topOffset)}px`);
}

void renderQr(qrElement!, {
  url: resolveQrUrl({
    currentUrl: window.location.href,
    isDev: import.meta.env.DEV,
    devLanHost: import.meta.env.VITE_DEV_LAN_HOST,
    autoDevLanHost: __AUTO_DEV_LAN_HOST__,
  }),
}).then(() => {
  syncQrDockPosition();
  requestAnimationFrame(syncQrDockPosition);
  if ('fonts' in document) {
    void document.fonts.ready.then(syncQrDockPosition);
  }
});

window.addEventListener('resize', syncQrDockPosition, { passive: true });
