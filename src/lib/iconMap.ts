import type { IconName } from '../types/icon';
import type { LinkItem } from '../types/config';

const ICON_NAME_SET = new Set<IconName>([
  'note',
  'linkedin',
  'x',
  'instagram',
  'facebook',
  'globe',
  'section',
  'link',
]);

function isIconName(value: string): value is IconName {
  return ICON_NAME_SET.has(value as IconName);
}

export function fallbackIconKey(link: Pick<LinkItem, 'url' | 'sourceType'>): IconName {
  if (link.sourceType === 'TWITTER_STATUS_LATEST') {
    return 'x';
  }

  if (!link.url) {
    return 'section';
  }

  let host = '';
  try {
    host = new URL(link.url).hostname.replace(/^www\./, '');
  } catch {
    return 'link';
  }

  if (host.includes('linkedin.')) return 'linkedin';
  if (host.includes('instagram.')) return 'instagram';
  if (host.includes('facebook.')) return 'facebook';
  if (host.includes('twitter.') || host.includes('x.com')) return 'x';
  if (host.includes('note.')) return 'note';

  return 'link';
}

export function resolveIconName(
  link: Pick<LinkItem, 'iconKey' | 'url' | 'sourceType'>,
): IconName {
  if (isIconName(link.iconKey)) {
    return link.iconKey;
  }

  return fallbackIconKey(link);
}
