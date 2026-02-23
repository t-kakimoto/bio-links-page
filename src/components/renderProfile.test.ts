import { describe, expect, it } from 'vitest';
import { renderProfile } from './renderProfile';

describe('renderProfile', () => {
  it('renders name and bio as plain text', () => {
    document.body.innerHTML = '<div id="profile"></div>';
    const container = document.querySelector<HTMLElement>('#profile');

    if (!container) {
      throw new Error('profile container not found in test setup');
    }

    renderProfile(container, {
      name: '<img src=x onerror=alert(1)>',
      bio: '<strong>bio</strong>',
      avatarUrl: 'https://example.com/avatar.jpg',
    });

    const name = container.querySelector('.profile-name');
    const bio = container.querySelector('.profile-bio');

    expect(name?.textContent).toBe('<img src=x onerror=alert(1)>');
    expect(name?.querySelector('img')).toBeNull();
    expect(bio?.textContent).toBe('<strong>bio</strong>');
    expect(bio?.querySelector('strong')).toBeNull();
  });

  it('hides bio element when bio is empty after trim', () => {
    document.body.innerHTML = '<div id="profile"></div>';
    const container = document.querySelector<HTMLElement>('#profile');

    if (!container) {
      throw new Error('profile container not found in test setup');
    }

    renderProfile(container, {
      name: 'User Name',
      bio: '   ',
      avatarUrl: 'https://example.com/avatar.jpg',
    });

    expect(container.querySelector('.profile-bio')).toBeNull();
  });
});
