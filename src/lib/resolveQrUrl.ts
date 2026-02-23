interface ResolveQrUrlOptions {
  currentUrl: string;
  isDev: boolean;
  devLanHost?: string;
  autoDevLanHost?: string;
}

const LOOPBACK_HOSTS = new Set(['localhost', '127.0.0.1', '::1']);

function normalizeHost(value?: string): string | null {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  if (trimmed.includes('://')) {
    try {
      return new URL(trimmed).hostname;
    } catch {
      return null;
    }
  }

  if (trimmed.includes('/')) {
    return trimmed.split('/')[0] || null;
  }

  return trimmed;
}

function resolveDevReplacementHost(options: ResolveQrUrlOptions): string | null {
  return normalizeHost(options.devLanHost) ?? normalizeHost(options.autoDevLanHost);
}

export function resolveQrUrl(options: ResolveQrUrlOptions): string {
  let url: URL;
  try {
    url = new URL(options.currentUrl);
  } catch {
    return options.currentUrl;
  }

  if (!options.isDev) {
    return url.toString();
  }

  if (!LOOPBACK_HOSTS.has(url.hostname)) {
    return url.toString();
  }

  const replacementHost = resolveDevReplacementHost(options);
  if (!replacementHost) {
    return url.toString();
  }

  url.hostname = replacementHost;
  return url.toString();
}
