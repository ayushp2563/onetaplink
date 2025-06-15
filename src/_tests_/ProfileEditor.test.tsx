import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProfileEditor from '../pages/ProfileEditor';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import * as reactRouterDom from 'react-router-dom';

// Mock dependencies
vi.mock('@/integrations/supabase/client', () => import('../../__mocks__/supabase'));
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));
vi.mock('@/hooks/usePageMetadata', () => ({
  usePageMetadata: vi.fn(),
}));
vi.mock('@/hooks/use-mobile', () => ({
  useIsMobile: () => false,
}));
vi.mock('../components/ProfileForm', () => ({
  default: ({ username }: { username: string }) => (
    <div data-testid="profile-form">Profile Form for {username}</div>
  ),
}));
vi.mock('@/components/ui/button', () => ({
  Button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
}));
vi.mock('@/components/ui/card', () => ({
  Card: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  CardHeader: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  CardTitle: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  CardDescription: ({ children, ...props }: any) => <div {...props}>{children}</div>,
}));
vi.mock('@/components/ui/avatar', () => ({
  Avatar: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  AvatarImage: ({ ...props }: any) => <img {...props} />,
  AvatarFallback: ({ children, ...props }: any) => <span {...props}>{children}</span>,
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  const useParams = vi.fn(() => ({ username: 'testuser' }));
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams
  };
});

describe('ProfileEditor', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows loading state initially', () => {
    render(
      <BrowserRouter>
        <ProfileEditor />
      </BrowserRouter>
    );
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders page content when authorized', async () => {
    render(
      <BrowserRouter>
        <ProfileEditor />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByText('Edit Profile')).toBeInTheDocument();
      expect(screen.getByTestId('profile-form')).toBeInTheDocument();
    });
  });
  it('handles missing username', async () => {
    // Patch global useParams to return {}
    (reactRouterDom.useParams as jest.Mock).mockReturnValue({});
    render(
      <BrowserRouter>
        <ProfileEditor />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByText('No username provided.')).toBeInTheDocument();
    });
  });
  });

