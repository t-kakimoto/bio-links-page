import { ICON_DEFINITIONS } from '../icons/catalog';
import type { IconRenderOptions } from '../types/icon';

export function renderIcon(options: IconRenderOptions): string {
  const icon = ICON_DEFINITIONS[options.name] ?? ICON_DEFINITIONS.link;
  const size = options.size ?? 22;
  const tone = options.tone ?? 'default';
  const style = options.style ?? 'solid';

  return `
    <svg
      class="icon icon--tone-${tone} icon--style-${style}"
      viewBox="${icon.viewBox}"
      width="${size}"
      height="${size}"
      aria-hidden="true"
      focusable="false"
    >
      ${icon.body}
    </svg>
  `;
}
