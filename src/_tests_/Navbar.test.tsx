
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
  Button: ({ children, ...props }: React.PropsWithChildren<React.ButtonHTMLAttributes<HTMLButtonElement>>) => <button {...props}>{children}</button>,
}));
vi.mock('@/components/ui/avatar', () => ({
  Avatar: ({ children, ...props }: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>) => <div {...props}>{children}</div>,
  AvatarImage: ({ ...props }: React.ImgHTMLAttributes<HTMLImageElement>) => <img {...props} />,
  AvatarFallback: ({ children, ...props }: React.PropsWithChildren<React.HTMLAttributes<HTMLSpanElement>>) => <span {...props}>{children}</span>,
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

    // Wait for the AvatarFallback to display the initial of the username (T)
    await waitFor(() => {
      expect(
        screen.getByText((content, el) => {
          return el?.tagName.toLowerCase() === 'span' && content.trim() === 'T';
        })
      ).toBeInTheDocument();
    });

    // Find the Sign Out button by role button and name (case-insensitive, partial match)
    const signOutButton = await screen.findByRole('button', { name: /sign out/i });
    expect(signOutButton).toBeInTheDocument();
    fireEvent.click(signOutButton);
    expect(mockSignOut).toHaveBeenCalled();
  });
});
