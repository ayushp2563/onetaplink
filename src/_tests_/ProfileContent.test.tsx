import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ProfileContent, Link } from '../components/layouts/ProfileContent';
import { LAYOUT_TYPES } from '../constants/layouts';
import { vi } from 'vitest';

// Mock layout components (must be named exports to match import)
vi.mock('@/components/layouts/LinksLayout', () => ({
  __esModule: true,
  LinksLayout: ({ links }: { links: any[] }) => (
    <div data-testid="links-layout">Links Layout - {links.length} links</div>
  ),
}));
vi.mock('@/components/layouts/BentoLayout', () => ({
  __esModule: true,
  BentoLayout: ({ links }: { links: any[] }) => (
    <div data-testid="bento-layout">Bento Layout - {links.length} links</div>
  ),
}));
vi.mock('@/components/layouts/MixedLayout', () => ({
  __esModule: true,
  MixedLayout: ({ links }: { links: any[] }) => (
    <div data-testid="mixed-layout">Mixed Layout - {links.length} links</div>
  ),
}));

// Add mock for card if used in layouts (to avoid errors in all layouts)
vi.mock('@/components/ui/card', () => ({
  Card: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  CardHeader: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  CardTitle: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  CardDescription: ({ children, ...props }: any) => <div {...props}>{children}</div>,
}));
vi.mock('@/components/ui/button', () => ({
  Button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
}));
vi.mock('@/components/ui/avatar', () => ({
  Avatar: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  AvatarImage: ({ ...props }: any) => <img {...props} />,
  AvatarFallback: ({ children, ...props }: any) => <span {...props}>{children}</span>,
}));

const mockLinks: Link[] = [
  { id: '1', title: 'Test Link', url: 'https://test.com', icon: 'link', display: 'both' },
  { id: '2', title: 'Another Link', url: 'https://example.com', icon: 'external-link', display: 'title' },
];

describe('ProfileContent', () => {
  it('renders LinksLayout by default', () => {
    render(
      <ProfileContent
        layoutType={LAYOUT_TYPES.LINKS}
        links={mockLinks}
        textShadowClass=""
      />
    );
    expect(screen.getByTestId('links-layout')).toBeInTheDocument();
    expect(screen.getByText('Links Layout - 2 links')).toBeInTheDocument();
  });

  it('renders BentoLayout when specified', () => {
    render(
      <ProfileContent
        layoutType={LAYOUT_TYPES.BENTO}
        links={mockLinks}
        textShadowClass=""
      />
    );
    expect(screen.getByTestId('bento-layout')).toBeInTheDocument();
    expect(screen.getByText('Bento Layout - 2 links')).toBeInTheDocument();
  });

  it('renders MixedLayout when specified', () => {
    render(
      <ProfileContent
        layoutType={LAYOUT_TYPES.MIXED}
        links={mockLinks}
        textShadowClass=""
      />
    );
    expect(screen.getByTestId('mixed-layout')).toBeInTheDocument();
    expect(screen.getByText('Mixed Layout - 2 links')).toBeInTheDocument();
  });

  it('handles empty links array', () => {
    render(
      <ProfileContent
        layoutType={LAYOUT_TYPES.LINKS}
        links={[]}
        textShadowClass=""
      />
    );
    expect(screen.getByText('Links Layout - 0 links')).toBeInTheDocument();
  });
});
