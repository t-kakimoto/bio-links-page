import type { SiteProfile } from '../types/config';

export function renderProfile(container: HTMLElement, profile: SiteProfile): void {
  const bio = profile.bio.trim();

  const avatarWrap = document.createElement('div');
  avatarWrap.className = 'profile-avatar-wrap';

  const avatar = document.createElement('img');
  avatar.className = 'profile-avatar';
  avatar.src = profile.avatarUrl;
  avatar.alt = `${profile.name} avatar`;
  avatar.loading = 'eager';
  avatarWrap.append(avatar);

  const meta = document.createElement('div');
  meta.className = 'profile-meta';

  const kicker = document.createElement('p');
  kicker.className = 'profile-kicker';
  kicker.textContent = 'BIO LINKS';

  const name = document.createElement('h1');
  name.className = 'profile-name';
  name.textContent = profile.name;

  meta.append(kicker, name);

  if (bio) {
    const bioElement = document.createElement('p');
    bioElement.className = 'profile-bio';
    bioElement.textContent = bio;
    meta.append(bioElement);
  }

  container.replaceChildren(avatarWrap, meta);
}
