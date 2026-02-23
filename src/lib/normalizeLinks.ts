import type { LinkGroup, LinkItem, LinkSeed, LinkVariant } from '../types/config';

function pickGroup(link: LinkSeed, headerPosition: number): LinkGroup {
  if (link.sourceType === 'HEADER') {
    return 'corporate';
  }

  return link.position > headerPosition ? 'corporate' : 'personal';
}

function pickVariant(link: LinkSeed, group: LinkGroup): LinkVariant {
  if (link.sourceType === 'HEADER') {
    return 'section-header';
  }

  if (link.sourceType === 'TWITTER_STATUS_LATEST') {
    return 'x';
  }

  if (group === 'personal') {
    return link.position === 0 ? 'spotlight' : 'social';
  }

  return 'corporate';
}

export function normalizeLinks(seeds: LinkSeed[]): LinkItem[] {
  const sorted = [...seeds].sort((left, right) => left.position - right.position);
  const headerPosition =
    sorted.find((link) => link.sourceType === 'HEADER')?.position ?? Number.POSITIVE_INFINITY;

  return sorted.map((seed) => {
    const group = pickGroup(seed, headerPosition);

    return {
      ...seed,
      group,
      variant: pickVariant(seed, group),
    };
  });
}
