
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ProfileContent } from '../components/layouts/ProfileContent';
import { LAYOUT_TYPES } from '../constants/layouts';
import { vi } from 'vitest';

// Mock layout components
vi.mock('@/components/layouts/LinksLayout', () => ({
  LinksLayout: ({ links }: { links: any[] }) => (
    <div data-testid="links-layout">Links Layout - {links.length} links</div>
  ),
}));
vi.mock('@/components/layouts/BentoLayout', () => ({
  BentoLayout: ({ links }: { links: any[] }) => (
    <div data-testid="bento-layout">Bento Layout - {links.length} links</div>
  ),
}));
vi.mock('@/components/layouts/MixedLayout', () => ({
  MixedLayout: ({ links }: { links: any[] }) => (
    <div data-testid="mixed-layout">Mixed Layout - {links.length} links</div>
  ),
}));

const mockLinks = [
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
