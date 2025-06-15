
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Index from '../pages/Index';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';

// Mock AuthProvider
vi.mock('@/components/AuthProvider', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => children,
  useAuth: () => ({
    session: { user: { id: 'test-user-id' } },
    user: { id: 'test-user-id' },
    loading: false,
    signOut: vi.fn(),
  }),
}));

// Mock other dependencies
vi.mock('@/integrations/supabase/client', () => import('../../__mocks__/supabase'));
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>) => <div {...props}>{children}</div>,
  },
}));
vi.mock('@/hooks/usePageMetadata', () => ({
  usePageMetadata: vi.fn(),
}));

vi.mock('@/components/ui/button', () => ({
  Button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
}));
vi.mock('@/components/ui/card', () => ({
  Card: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  CardHeader: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  CardTitle: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  CardDescription: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  CardContent: ({ children, ...props }: any) => <div {...props}>{children}</div>,
}));
vi.mock('@/components/ui/avatar', () => ({
  Avatar: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  AvatarImage: ({ ...props }: any) => <img {...props} />,
  AvatarFallback: ({ children, ...props }: any) => <span {...props}>{children}</span>,
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('Index (Dashboard)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders dashboard header', async () => {
    render(
      <BrowserRouter>
        <Index />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByText(/Welcome/)).toBeInTheDocument();
    });
  });

  it('shows loading state initially', () => {
    render(
      <BrowserRouter>
        <Index />
      </BrowserRouter>
    );
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('handles edit profile click', async () => {
    render(
      <BrowserRouter>
        <Index />
      </BrowserRouter>
    );
    await waitFor(() => {
      const editButton = screen.getByText('Edit Profile');
      fireEvent.click(editButton);
      expect(mockNavigate).toHaveBeenCalled();
    });
  });
});

