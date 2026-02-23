export type SourceLinkType = 'CLASSIC' | 'TWITTER_STATUS_LATEST' | 'HEADER';
export type LinkVariant =
  | 'spotlight'
  | 'social'
  | 'x'
  | 'section-header'
  | 'corporate';
export type LinkGroup = 'personal' | 'corporate';

export interface SiteProfile {
  name: string;
  bio: string;
  avatarUrl: string;
}

export interface LinkSeed {
  id: string;
  title: string;
  url?: string;
  position: number;
  sourceType: SourceLinkType;
  enabled: boolean;
  removeCandidate: boolean;
  iconKey: string;
}

export interface LinkItem {
  id: string;
  title: string;
  url?: string;
  position: number;
  sourceType: SourceLinkType;
  group: LinkGroup;
  variant: LinkVariant;
  enabled: boolean;
  removeCandidate: boolean;
  iconKey: string;
}
