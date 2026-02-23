import { resolveIconName } from '../lib/iconMap';
import { renderIcon } from '../lib/renderIcon';
import { normalizeExternalUrl } from '../lib/safeExternalUrl';
import type { IconStyle, IconTone } from '../types/icon';
import type { LinkItem, LinkVariant } from '../types/config';

interface RenderLinksOptions {
  personalContainer: HTMLElement;
  corporateContainer: HTMLElement;
}

interface IconPresentation {
  tone: IconTone;
  style: IconStyle;
}

export function getIconPresentation(variant: LinkVariant): IconPresentation {
  if (variant === 'section-header') {
    return { tone: 'muted', style: 'solid' };
  }

  return { tone: 'default', style: 'outline' };
}

function renderLinkCard(link: LinkItem, index: number): HTMLElement | null {
  if (link.variant === 'section-header') {
    const header = document.createElement('h3');
    header.className = 'link-section-header';
    header.textContent = link.title;
    header.style.setProperty('--stagger-index', String(index));
    return header;
  }

  const href = normalizeExternalUrl(link.url);
  if (!href) {
    if (import.meta.env.DEV) {
      console.warn(
        `[renderLinks] skipped non-https or invalid URL for link id="${link.id}" title="${link.title}"`,
      );
    }
    return null;
  }

  const anchor = document.createElement('a');
  anchor.href = href;
  anchor.target = '_blank';
  anchor.rel = 'noopener noreferrer';
  anchor.className = `link-card link-card--${link.variant}`;
  anchor.style.setProperty('--stagger-index', String(index));
  anchor.dataset.removeCandidate = String(link.removeCandidate);

  const iconPresentation = getIconPresentation(link.variant);
  const iconName = resolveIconName(link);

  const iconWrap = document.createElement('span');
  iconWrap.className = [
    'link-icon-wrap',
    `link-icon-wrap--tone-${iconPresentation.tone}`,
    `link-icon-wrap--style-${iconPresentation.style}`,
  ].join(' ');
  iconWrap.setAttribute('aria-hidden', 'true');
  // Icon SVG is sourced from internal icon catalog definitions.
  iconWrap.innerHTML = renderIcon({
    name: iconName,
    tone: iconPresentation.tone,
    style: iconPresentation.style,
    size: 22,
  });

  const textWrap = document.createElement('span');
  textWrap.className = 'link-text-wrap';

  const title = document.createElement('span');
  title.className = 'link-title';
  title.textContent = link.title;

  textWrap.append(title);
  anchor.replaceChildren(iconWrap, textWrap);

  return anchor;
}

function renderGroup(container: HTMLElement, links: LinkItem[]): void {
  container.replaceChildren();

  links
    .filter((link) => link.enabled)
    .forEach((link, index) => {
      const card = renderLinkCard(link, index);
      if (card) {
        container.appendChild(card);
      }
    });
}

export function renderLinks(links: LinkItem[], options: RenderLinksOptions): void {
  const ordered = [...links].sort((left, right) => left.position - right.position);
  const personalLinks = ordered.filter((link) => link.group === 'personal');
  const corporateLinks = ordered.filter((link) => link.group === 'corporate');

  renderGroup(options.personalContainer, personalLinks);
  renderGroup(options.corporateContainer, corporateLinks);
}
