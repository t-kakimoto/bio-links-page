import type { IconDefinition, IconName } from '../../types/icon';
import noteIcon from './note';
import linkedinIcon from './linkedin';
import xIcon from './x';
import instagramIcon from './instagram';
import facebookIcon from './facebook';
import githubIcon from './github';
import globeIcon from './globe';
import sectionIcon from './section';
import linkIcon from './link';

export const ICON_DEFINITIONS: Record<IconName, IconDefinition> = {
  note: noteIcon,
  linkedin: linkedinIcon,
  x: xIcon,
  instagram: instagramIcon,
  facebook: facebookIcon,
  github: githubIcon,
  globe: globeIcon,
  section: sectionIcon,
  link: linkIcon,
};
