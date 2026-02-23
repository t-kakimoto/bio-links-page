// @vitest-environment jsdom

import { describe, expect, it } from 'vitest';
import { getIconPresentation, renderLinks } from '../components/renderLinks';
import { LINKS_CONFIG } from '../data/links.config';
import type { LinkSeed } from '../types/config';
import { normalizeExternalUrl } from './safeExternalUrl';
import { normalizeLinks } from './normalizeLinks';

function countRenderableGroupLinks(
  links: ReturnType<typeof normalizeLinks>,
  group: 'personal' | 'corporate',
): number {
  return links.filter(
    (link) =>
      link.group === group &&
      link.enabled &&
      link.variant !== 'section-header' &&
      normalizeExternalUrl(link.url) !== null,
  ).length;
}

describe('normalizeLinks', () => {
  it('returns links sorted by position', () => {
    const seeds: LinkSeed[] = [
      {
        id: 'b',
        title: 'B',
        url: 'https://example.com/b',
        position: 2,
        sourceType: 'CLASSIC',
        enabled: true,
        removeCandidate: false,
        iconKey: 'link',
      },
      {
        id: 'a',
        title: 'A',
        url: 'https://example.com/a',
        position: 1,
        sourceType: 'CLASSIC',
        enabled: true,
        removeCandidate: false,
        iconKey: 'link',
      },
      {
        id: 'header',
        title: 'Header',
        position: 10,
        sourceType: 'HEADER',
        enabled: true,
        removeCandidate: false,
        iconKey: 'section',
      },
    ];

    const normalized = normalizeLinks(seeds);

    expect(normalized).toHaveLength(3);
    expect(normalized.map((item) => item.id)).toEqual(['a', 'b', 'header']);
  });

  it('maps source types into expected variants and groups', () => {
    const seeds: LinkSeed[] = [
      {
        id: 'first-classic',
        title: 'First Classic',
        url: 'https://example.com/first',
        position: 0,
        sourceType: 'CLASSIC',
        enabled: true,
        removeCandidate: false,
        iconKey: 'link',
      },
      {
        id: 'second-classic',
        title: 'Second Classic',
        url: 'https://example.com/second',
        position: 1,
        sourceType: 'CLASSIC',
        enabled: true,
        removeCandidate: false,
        iconKey: 'link',
      },
      {
        id: 'x-link',
        title: 'X Link',
        url: 'https://x.com/example',
        position: 2,
        sourceType: 'TWITTER_STATUS_LATEST',
        enabled: true,
        removeCandidate: false,
        iconKey: 'x',
      },
      {
        id: 'corp-header',
        title: 'Corp',
        position: 7,
        sourceType: 'HEADER',
        enabled: true,
        removeCandidate: false,
        iconKey: 'section',
      },
      {
        id: 'corp-classic',
        title: 'Corporate Site',
        url: 'https://example.com/corp',
        position: 8,
        sourceType: 'CLASSIC',
        enabled: true,
        removeCandidate: false,
        iconKey: 'globe',
      },
    ];

    const normalized = normalizeLinks(seeds);

    const first = normalized.find((item) => item.id === 'first-classic');
    const second = normalized.find((item) => item.id === 'second-classic');
    const xLink = normalized.find((item) => item.id === 'x-link');
    const header = normalized.find((item) => item.id === 'corp-header');
    const corporate = normalized.find((item) => item.id === 'corp-classic');

    expect(first?.group).toBe('personal');
    expect(first?.variant).toBe('spotlight');

    expect(second?.group).toBe('personal');
    expect(second?.variant).toBe('social');

    expect(xLink?.variant).toBe('x');

    expect(header?.group).toBe('corporate');
    expect(header?.variant).toBe('section-header');

    expect(corporate?.group).toBe('corporate');
    expect(corporate?.variant).toBe('corporate');
  });

  it('keeps enabled/removeCandidate flags for operations', () => {
    const cloned = structuredClone(LINKS_CONFIG);
    cloned[0].enabled = false;
    cloned[0].removeCandidate = true;

    const normalized = normalizeLinks(cloned);
    const first = normalized.find((item) => item.id === cloned[0].id);

    expect(first?.enabled).toBe(false);
    expect(first?.removeCandidate).toBe(true);
  });
});

describe('renderLinks', () => {
  it('does not render disabled links in the DOM', () => {
    document.body.innerHTML = `
      <div id="personal"></div>
      <div id="corporate"></div>
    `;

    const personalContainer = document.querySelector<HTMLElement>('#personal');
    const corporateContainer = document.querySelector<HTMLElement>('#corporate');

    if (!personalContainer || !corporateContainer) {
      throw new Error('containers not found in test setup');
    }

    const normalized = normalizeLinks(LINKS_CONFIG);
    const target = normalized.find(
      (link) => link.group === 'personal' && link.variant !== 'section-header',
    );

    if (!target) {
      throw new Error('no personal link found in test setup');
    }

    target.enabled = false;

    renderLinks(normalized, { personalContainer, corporateContainer });

    const personalAnchors = personalContainer.querySelectorAll('a.link-card');
    expect(personalAnchors).toHaveLength(countRenderableGroupLinks(normalized, 'personal'));
    expect(personalContainer.textContent).not.toContain(target.title);
  });

  it('skips non-https links from rendering', () => {
    document.body.innerHTML = `
      <div id="personal"></div>
      <div id="corporate"></div>
    `;

    const personalContainer = document.querySelector<HTMLElement>('#personal');
    const corporateContainer = document.querySelector<HTMLElement>('#corporate');

    if (!personalContainer || !corporateContainer) {
      throw new Error('containers not found in test setup');
    }

    const cloned = structuredClone(LINKS_CONFIG);
    const target = cloned.find(
      (link) => link.sourceType === 'CLASSIC' && typeof link.url === 'string',
    );

    if (!target) {
      throw new Error('no classic link found in test setup');
    }

    target.title = 'Insecure HTTP link';
    target.url = 'http://example.com';

    const normalized = normalizeLinks(cloned);
    renderLinks(normalized, { personalContainer, corporateContainer });

    const personalAnchors = personalContainer.querySelectorAll('a.link-card');
    expect(personalAnchors).toHaveLength(countRenderableGroupLinks(normalized, 'personal'));
    expect(personalContainer.textContent).not.toContain('Insecure HTTP link');
  });

  it('renders link titles as plain text instead of HTML', () => {
    document.body.innerHTML = `
      <div id="personal"></div>
      <div id="corporate"></div>
    `;

    const personalContainer = document.querySelector<HTMLElement>('#personal');
    const corporateContainer = document.querySelector<HTMLElement>('#corporate');

    if (!personalContainer || !corporateContainer) {
      throw new Error('containers not found in test setup');
    }

    const cloned = structuredClone(LINKS_CONFIG);
    cloned[0].title = '<strong>Injected</strong>';
    const normalized = normalizeLinks(cloned);

    renderLinks(normalized, { personalContainer, corporateContainer });

    const spotlightTitle = personalContainer.querySelector('.link-card--spotlight .link-title');
    expect(spotlightTitle?.textContent).toBe('<strong>Injected</strong>');
    expect(spotlightTitle?.querySelector('strong')).toBeNull();
  });

  it('applies expected icon tone/style classes per variant', () => {
    document.body.innerHTML = `
      <div id="personal"></div>
      <div id="corporate"></div>
    `;

    const personalContainer = document.querySelector<HTMLElement>('#personal');
    const corporateContainer = document.querySelector<HTMLElement>('#corporate');

    if (!personalContainer || !corporateContainer) {
      throw new Error('containers not found in test setup');
    }

    const normalized = normalizeLinks(LINKS_CONFIG);
    renderLinks(normalized, { personalContainer, corporateContainer });

    const spotlight = personalContainer.querySelector('.link-card--spotlight .link-icon-wrap');
    const social = personalContainer.querySelector('.link-card--social .link-icon-wrap');
    const xCard = personalContainer.querySelector('.link-card--x .link-icon-wrap');
    const corporate = corporateContainer.querySelector('.link-card--corporate .link-icon-wrap');

    expect(spotlight?.className).toContain('link-icon-wrap--tone-default');
    expect(spotlight?.className).toContain('link-icon-wrap--style-outline');

    expect(social?.className).toContain('link-icon-wrap--tone-default');
    expect(social?.className).toContain('link-icon-wrap--style-outline');

    expect(xCard?.className).toContain('link-icon-wrap--tone-default');
    expect(xCard?.className).toContain('link-icon-wrap--style-outline');

    expect(corporate?.className).toContain('link-icon-wrap--tone-default');
    expect(corporate?.className).toContain('link-icon-wrap--style-outline');
  });
});

describe('getIconPresentation', () => {
  it('returns stable mapping for each link variant', () => {
    expect(getIconPresentation('spotlight')).toEqual({ tone: 'default', style: 'outline' });
    expect(getIconPresentation('social')).toEqual({ tone: 'default', style: 'outline' });
    expect(getIconPresentation('x')).toEqual({ tone: 'default', style: 'outline' });
    expect(getIconPresentation('corporate')).toEqual({ tone: 'default', style: 'outline' });
    expect(getIconPresentation('section-header')).toEqual({ tone: 'muted', style: 'solid' });
  });
});
