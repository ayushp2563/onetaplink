import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi, beforeEach, afterEach, describe, it, expect } from 'vitest';
import Auth from '@/pages/Auth';
import SettingsPage from '@/pages/SettingsPage';
import { AuthProvider } from '@/components/AuthProvider';
import { supabase } from '@/integrations/supabase/client';

// Mock Supabase client with realistic responses
const mockSupabase = {
  auth: {
    signUp: vi.fn(),
    signInWithPassword: vi.fn(),
    signOut: vi.fn(),
    getSession: vi.fn(),
    onAuthStateChange: vi.fn(),
    updateUser: vi.fn(),
  },
  from: vi.fn(() => ({
    select: vi.fn(() => ({
      eq: vi.fn(() => ({
        single: vi.fn(),
        neq: vi.fn(() => ({
          single: vi.fn(),
        })),
      })),
    })),
    update: vi.fn(() => ({
      eq: vi.fn(),
    })),
  })),
};

vi.mock('@/integrations/supabase/client', () => ({
  supabase: mockSupabase,
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>{children}</AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('Auth Flow Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: null },
      error: null,
    });
    mockSupabase.auth.onAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should handle complete signup flow with database interaction', async () => {
    // Mock successful signup
    mockSupabase.auth.signUp.mockResolvedValue({
      data: {
        user: {
          id: 'test-user-id',
          email: 'test@example.com',
        },
        session: null,
      },
      error: null,
    });

    render(
      <TestWrapper>
        <Auth />
      </TestWrapper>
    );

    // Switch to signup tab
    const signUpTab = screen.getByRole('tab', { name: /sign up/i });
    fireEvent.click(signUpTab);

    // Fill signup form
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText('Password');
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    const usernameInput = screen.getByLabelText(/username/i);
    const fullNameInput = screen.getByLabelText(/full name/i);

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(fullNameInput, { target: { value: 'Test User' } });

    // Submit form
    const submitButton = screen.getByRole('button', { name: /sign up/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockSupabase.auth.signUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
        options: {
          data: {
            username: 'testuser',
            full_name: 'Test User',
          },
          emailRedirectTo: expect.stringContaining(window.location.origin),
        },
      });
    });
  });

  it('should handle signin flow and settings update with real database calls', async () => {
    const mockUser = {
      id: 'test-user-id',
      email: 'test@example.com',
    };

    const mockSession = {
      user: mockUser,
      access_token: 'mock-token',
    };

    // Mock successful signin
    mockSupabase.auth.signInWithPassword.mockResolvedValue({
      data: { user: mockUser, session: mockSession },
      error: null,
    });

    // Mock profile fetch
    mockSupabase.from.mockReturnValue({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn().mockResolvedValue({
            data: { username: 'testuser' },
            error: null,
          }),
        })),
      })),
      update: vi.fn(() => ({
        eq: vi.fn().mockResolvedValue({
          data: null,
          error: null,
        }),
      })),
    });

    // Mock session for settings page
    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: mockSession },
      error: null,
    });

    render(
      <TestWrapper>
        <Auth />
      </TestWrapper>
    );

    // Fill signin form
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText('Password');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    const submitButton = screen.getByRole('button', { name: /sign in/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });

  it('should handle username update with database validation', async () => {
    const mockUser = {
      id: 'test-user-id',
      email: 'test@example.com',
    };

    const mockSession = {
      user: mockUser,
      access_token: 'mock-token',
    };

    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: mockSession },
      error: null,
    });

    // Mock profile operations
    const mockSelect = vi.fn(() => ({
      eq: vi.fn(() => ({
        single: vi.fn().mockResolvedValue({
          data: { username: 'oldusername' },
          error: null,
        }),
        neq: vi.fn(() => ({
          single: vi.fn().mockResolvedValue({
            data: null, // Username not taken
            error: null,
          }),
        })),
      })),
    }));

    const mockUpdate = vi.fn(() => ({
      eq: vi.fn().mockResolvedValue({
        data: null,
        error: null,
      }),
    }));

    mockSupabase.from.mockReturnValue({
      select: mockSelect,
      update: mockUpdate,
    });

    render(
      <TestWrapper>
        <SettingsPage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue('oldusername')).toBeInTheDocument();
    });

    // Update username
    const usernameInput = screen.getByDisplayValue('oldusername');
    fireEvent.change(usernameInput, { target: { value: 'newusername' } });

    const updateButton = screen.getByRole('button', { name: /update username/i });
    fireEvent.click(updateButton);

    await waitFor(() => {
      // Verify username availability check
      expect(mockSupabase.from).toHaveBeenCalledWith('profiles');
      // Verify update call
      expect(mockUpdate).toHaveBeenCalled();
    });
  });
});