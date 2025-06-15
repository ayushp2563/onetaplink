import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';

const mockSignOut = vi.fn();

// Fix Supabase mock for from (syntax error: add closing parenthesis)
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: () => ({
      select: () => ({
        eq: () => ({
          single: async () => ({
            data: { username: 'testuser' },
          }),
        }),
      }),
    }),
  },
}));

vi.mock('@/components/AuthProvider', () => ({
  useAuth: () => ({
    session: { user: { id: 'test-user-id' } },
    user: { id: 'test-user-id' },
    loading: false,
    signOut: mockSignOut,
  }),
}));

vi.mock('@/components/theme-provider', () => ({
  useTheme: () => ({
    theme: 'light',
    setTheme: vi.fn(),
  }),
}));

vi.mock('@/components/ui/button', () => ({
  Button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
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

import Navbar from '../components/Navbar';

describe('Navbar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows sign out when authenticated', async () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );
    // Avatar Fallback should show first char of username ("T")
    expect(await screen.findByText('T')).toBeInTheDocument();
    // Find the Sign Out button by role button and name
    const signOutButton = await screen.findByRole('button', { name: /sign out/i });
    expect(signOutButton).toBeInTheDocument();
    fireEvent.click(signOutButton);
    expect(mockSignOut).toHaveBeenCalled();
  });
});
