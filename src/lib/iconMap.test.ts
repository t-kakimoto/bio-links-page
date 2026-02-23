import { describe, expect, it } from 'vitest';
import type { LinkItem } from '../types/config';
import { fallbackIconKey, resolveIconName } from './iconMap';

describe('iconMap fallback/resolve', () => {
  it('maps known hosts to expected IconName values', () => {
    const fixtures: Array<{ url: string; expected: string }> = [
      { url: 'https://www.linkedin.com/in/example/', expected: 'linkedin' },
      { url: 'https://www.instagram.com/example/', expected: 'instagram' },
      { url: 'https://www.facebook.com/example.user', expected: 'facebook' },
      { url: 'https://github.com/example', expected: 'github' },
      { url: 'https://x.com/example', expected: 'x' },
      { url: 'https://note.com/example', expected: 'note' },
      { url: 'https://www.example.org/', expected: 'link' },
    ];

    fixtures.forEach((fixture) => {
      expect(
        fallbackIconKey({
          sourceType: 'CLASSIC',
          url: fixture.url,
        }),
      ).toBe(fixture.expected);
    });
  });

  it('prefers explicit icon keys when valid', () => {
    const item = {
      iconKey: 'globe',
      sourceType: 'CLASSIC',
      url: 'https://www.example.org/',
    } as Pick<LinkItem, 'iconKey' | 'sourceType' | 'url'>;

    expect(resolveIconName(item)).toBe('globe');
  });

  it('falls back to derived key when iconKey is unknown', () => {
    const item = {
      iconKey: 'unknown-key',
      sourceType: 'CLASSIC',
      url: 'https://www.linkedin.com/company/example-org/',
    } as Pick<LinkItem, 'iconKey' | 'sourceType' | 'url'>;

    expect(resolveIconName(item)).toBe('linkedin');
  });

  it('returns section icon when URL is missing', () => {
    expect(
      fallbackIconKey({
        sourceType: 'HEADER',
      }),
    ).toBe('section');
  });

  it('returns link icon for invalid URLs instead of throwing', () => {
    expect(() =>
      fallbackIconKey({
        sourceType: 'CLASSIC',
        url: 'not a valid url',
      }),
    ).not.toThrow();

    expect(
      fallbackIconKey({
        sourceType: 'CLASSIC',
        url: 'not a valid url',
      }),
    ).toBe('link');
  });
});
