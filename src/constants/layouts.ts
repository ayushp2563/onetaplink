
export const LAYOUT_TYPES = {
  LINKS: 'links',
  BENTO: 'bento',
  MIXED: 'mixed'
} as const;

export type LayoutType = typeof LAYOUT_TYPES[keyof typeof LAYOUT_TYPES];
