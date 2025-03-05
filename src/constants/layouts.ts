
export const LAYOUT_TYPES = {
  LINKS: 'links',
  BENTO: 'bento',
  MIXED: 'mixed',
} as const;

export type LayoutType = typeof LAYOUT_TYPES[keyof typeof LAYOUT_TYPES];

export interface LayoutOption {
  id: LayoutType;
  name: string;
  description: string;
  icon: string;
}

export const LAYOUT_OPTIONS: LayoutOption[] = [
  {
    id: LAYOUT_TYPES.LINKS,
    name: 'Simple Links',
    description: 'Linktree-like vertical list of links',
    icon: 'list',
  },
  {
    id: LAYOUT_TYPES.BENTO,
    name: 'Bento Grid',
    description: 'Modern grid layout with cards',
    icon: 'layout-grid',
  },
  {
    id: LAYOUT_TYPES.MIXED,
    name: 'Mixed Layout',
    description: 'Combination of links and grid items',
    icon: 'layout',
  },
];
