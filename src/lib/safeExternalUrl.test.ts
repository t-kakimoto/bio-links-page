import { describe, expect, it } from 'vitest';
import { isAllowedExternalUrl, normalizeExternalUrl } from './safeExternalUrl';

describe('safeExternalUrl', () => {
  it('accepts https absolute URLs', () => {
    expect(normalizeExternalUrl('https://example.com/path?x=1#hash')).toBe(
      'https://example.com/path?x=1#hash',
    );
    expect(isAllowedExternalUrl('https://example.com')).toBe(true);
  });

  it('rejects http URLs', () => {
    expect(normalizeExternalUrl('http://example.com')).toBeNull();
    expect(isAllowedExternalUrl('http://example.com')).toBe(false);
  });

  it('rejects javascript URLs', () => {
    expect(normalizeExternalUrl('javascript:alert(1)')).toBeNull();
    expect(isAllowedExternalUrl('javascript:alert(1)')).toBe(false);
  });

  it('rejects invalid or empty values', () => {
    expect(normalizeExternalUrl('')).toBeNull();
    expect(normalizeExternalUrl('not a url')).toBeNull();
    expect(normalizeExternalUrl('   ')).toBeNull();
  });
});
