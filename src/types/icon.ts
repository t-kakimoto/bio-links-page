export type IconName =
  | 'note'
  | 'linkedin'
  | 'x'
  | 'instagram'
  | 'facebook'
  | 'github'
  | 'globe'
  | 'section'
  | 'link';

export type IconTone = 'default' | 'muted' | 'emphasis';
export type IconStyle = 'solid' | 'outline';

export interface IconRenderOptions {
  name: IconName;
  tone?: IconTone;
  style?: IconStyle;
  size?: number;
}

export interface IconDefinition {
  viewBox: string;
  body: string;
}
