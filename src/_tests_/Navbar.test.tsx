import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';

const mockSignOut = vi.fn();

// ✅ Mock Supabase
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
    }
)} // <-- Add closing parenthesis for 'from' function
}));

// ✅ Mock AuthProvider
vi.mock('@/components/AuthProvider', () => ({
  useAuth: () => ({
    session: { user: { id: 'test-user-id' } },
    user: { id: 'test-user-id' },
    loading: false,
    signOut: mockSignOut,
  }),
}));

// ✅ Mock Theme Provider
vi.mock('@/components/theme-provider', () => ({
  useTheme: () => ({
    theme: 'light',
    setTheme: vi.fn(),
  }),
}));

// ✅ Mock react-router-dom navigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Import component AFTER mocks
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

    // ✅ Wait for Sign Out button to appear (matching partial text to avoid element splitting issues)
    const signOutButton = await waitFor(() =>
      screen.getByRole('button', { name: /sign out/i })
    );

    expect(signOutButton).toBeInTheDocument();

    // ✅ Click and check if mockSignOut was called
    fireEvent.click(signOutButton);
    expect(mockSignOut).toHaveBeenCalled();
  });
});
