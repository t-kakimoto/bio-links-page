const HTTPS_PROTOCOL = 'https:';

export function normalizeExternalUrl(value?: string): string | null {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  try {
    const url = new URL(trimmed);
    if (url.protocol !== HTTPS_PROTOCOL) {
      return null;
    }

    return url.toString();
  } catch {
    return null;
  }
}

export function isAllowedExternalUrl(value?: string): boolean {
  return normalizeExternalUrl(value) !== null;
}
