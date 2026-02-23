import { describe, expect, it } from 'vitest';
import { resolveQrUrl } from './resolveQrUrl';

describe('resolveQrUrl', () => {
  it('keeps URL unchanged in production mode', () => {
    const result = resolveQrUrl({
      currentUrl: 'https://vaulqex.github.io/bio-links-page/?ref=qr',
      isDev: false,
      devLanHost: '192.168.1.10',
      autoDevLanHost: '192.168.1.20',
    });

    expect(result).toBe('https://vaulqex.github.io/bio-links-page/?ref=qr');
  });

  it('replaces loopback host with VITE_DEV_LAN_HOST in dev mode', () => {
    const result = resolveQrUrl({
      currentUrl: 'http://localhost:5173/path?a=1#qr',
      isDev: true,
      devLanHost: '192.168.1.50',
      autoDevLanHost: '192.168.1.20',
    });

    expect(result).toBe('http://192.168.1.50:5173/path?a=1#qr');
  });

  it('replaces loopback host with auto-detected LAN host when env override is missing', () => {
    const result = resolveQrUrl({
      currentUrl: 'http://127.0.0.1:4173/',
      isDev: true,
      autoDevLanHost: '10.0.0.42',
    });

    expect(result).toBe('http://10.0.0.42:4173/');
  });

  it('keeps URL unchanged when host is already a LAN address', () => {
    const result = resolveQrUrl({
      currentUrl: 'http://192.168.1.5:5173/',
      isDev: true,
      devLanHost: '192.168.1.10',
      autoDevLanHost: '192.168.1.20',
    });

    expect(result).toBe('http://192.168.1.5:5173/');
  });

  it('keeps URL unchanged in dev mode when no replacement host is available', () => {
    const result = resolveQrUrl({
      currentUrl: 'http://localhost:5173/',
      isDev: true,
      devLanHost: '',
      autoDevLanHost: '',
    });

    expect(result).toBe('http://localhost:5173/');
  });
});
