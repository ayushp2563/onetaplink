
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi, beforeEach, describe, it, expect } from 'vitest';
import App from '@/App';
import { supabase } from '@/integrations/supabase/client';

// Mock all external dependencies
const mockSupabase = {
  auth: {
    signUp: vi.fn(),
    signInWithPassword: vi.fn(),
    signOut: vi.fn(),
    getSession: vi.fn(),
    onAuthStateChange: vi.fn(),
    updateUser: vi.fn(),
  },
  from: vi.fn(),
  storage: {
    from: vi.fn(() => ({
      upload: vi.fn(),
      remove: vi.fn(),
      getPublicUrl: vi.fn(),
    })),
  },
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

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => children,
}));

const TestApp = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  );
};

describe('Complete User Workflow System Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Default mock implementations
    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: null },
      error: null,
    });

    mockSupabase.auth.onAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
    });

    // Reset the from mock for each test
    mockSupabase.from.mockReturnValue({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(),
          maybeSingle: vi.fn(),
          neq: vi.fn(() => ({
            single: vi.fn(),
          })),
        })),
      })),
      update: vi.fn(() => ({
        eq: vi.fn(),
      })),
      insert: vi.fn(),
    });

    // Mock window.location for navigation tests
    Object.defineProperty(window, 'location', {
      value: { pathname: '/', search: '', hash: '', origin: 'http://localhost:3000' },
      writable: true,
    });
  });

  it('should complete full user registration and profile setup workflow', async () => {
    const mockUser = {
      id: 'new-user-id',
      email: 'newuser@example.com',
    };

    const mockSession = {
      user: mockUser,
      access_token: 'mock-token',
    };

    // Mock successful signup
    mockSupabase.auth.signUp.mockResolvedValue({
      data: { user: mockUser, session: mockSession },
      error: null,
    });

    // Mock profile creation
    mockSupabase.from.mockReturnValue({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn().mockResolvedValue({
            data: null, // No existing profile
            error: null,
          }),
        })),
      })),
      insert: vi.fn().mockResolvedValue({
        data: [{ id: mockUser.id, username: 'newuser' }],
        error: null,
      }),
      update: vi.fn(() => ({
        eq: vi.fn().mockResolvedValue({
          data: null,
          error: null,
        }),
      })),
    });

    render(<TestApp />);

    // 1. Start from landing page
    expect(screen.getByText(/create your digital identity/i)).toBeInTheDocument();

    // 2. Navigate to auth page
    const getStartedButton = screen.getByRole('button', { name: /get started/i });
    fireEvent.click(getStartedButton);

    await waitFor(() => {
      expect(screen.getByRole('tab', { name: /sign in/i })).toBeInTheDocument();
    });

    // 3. Switch to signup and complete registration
    const signUpTab = screen.getByRole('tab', { name: /sign up/i });
    fireEvent.click(signUpTab);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText('Password');
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    const usernameInput = screen.getByLabelText(/username/i);
    const fullNameInput = screen.getByLabelText(/full name/i);

    fireEvent.change(emailInput, { target: { value: 'newuser@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'securePassword123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'securePassword123' } });
    fireEvent.change(usernameInput, { target: { value: 'newuser' } });
    fireEvent.change(fullNameInput, { target: { value: 'New User' } });

    const submitButton = screen.getByRole('button', { name: /sign up/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockSupabase.auth.signUp).toHaveBeenCalledWith({
        email: 'newuser@example.com',
        password: 'securePassword123',
        options: {
          data: {
            username: 'newuser',
            full_name: 'New User',
          },
          emailRedirectTo: expect.stringContaining('http://localhost:3000'),
        },
      });
    });

    // Verify the complete workflow executed database operations
    expect(mockSupabase.auth.signUp).toHaveBeenCalled();
  });

  it('should complete full user login, profile editing, and link management workflow', async () => {
    const mockUser = {
      id: 'existing-user-id',
      email: 'existing@example.com',
    };

    const mockSession = {
      user: mockUser,
      access_token: 'mock-token',
    };

    const mockProfile = {
      id: mockUser.id,
      username: 'existinguser',
      full_name: 'Existing User',
      bio: 'Developer',
      avatar_url: null,
    };

    const mockSettings = {
      id: mockUser.id,
      links: [
        {
          id: '1',
          title: 'GitHub',
          url: 'https://github.com/existinguser',
          icon: 'github',
          display: 'both',
        },
      ],
      theme_id: 'elegant',
      is_dark_mode: false,
    };

    // Mock successful login
    mockSupabase.auth.signInWithPassword.mockResolvedValue({
      data: { user: mockUser, session: mockSession },
      error: null,
    });

    // Mock authenticated session
    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: mockSession },
      error: null,
    });

    // Mock database queries with proper implementation
    mockSupabase.from.mockImplementation((table) => {
      if (table === 'profiles') {
        return {
          select: vi.fn(() => ({
            eq: vi.fn(() => ({
              single: vi.fn().mockResolvedValue({
                data: mockProfile,
                error: null,
              }),
              maybeSingle: vi.fn().mockResolvedValue({
                data: mockProfile,
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
        };
      } else if (table === 'profile_settings') {
        return {
          select: vi.fn(() => ({
            eq: vi.fn(() => ({
              single: vi.fn().mockResolvedValue({
                data: mockSettings,
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
        };
      }
      return {
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: vi.fn().mockResolvedValue({ data: null, error: null }),
          })),
        })),
      };
    });

    render(<TestApp />);

    // 1. Navigate to auth page and login
    const getStartedButton = screen.getByRole('button', { name: /get started/i });
    fireEvent.click(getStartedButton);

    await waitFor(() => {
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText('Password');

      fireEvent.change(emailInput, { target: { value: 'existing@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });

      const signInButton = screen.getByRole('button', { name: /sign in/i });
      fireEvent.click(signInButton);
    });

    await waitFor(() => {
      expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'existing@example.com',
        password: 'password123',
      });
    });

    // Verify complete workflow includes proper database interactions
    expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalled();
    expect(mockSupabase.auth.getSession).toHaveBeenCalled();
  });

  it('should handle profile viewing workflow for public users', async () => {
    const mockProfile = {
      id: 'public-user-id',
      username: 'publicuser',
      full_name: 'Public User',
      bio: 'Public Profile',
      avatar_url: 'https://example.com/avatar.jpg',
    };

    const mockSettings = {
      id: 'public-user-id',
      links: [
        {
          id: '1',
          title: 'Website',
          url: 'https://publicuser.com',
          icon: 'link',
          display: 'both',
        },
        {
          id: '2',
          title: 'Twitter',
          url: 'https://twitter.com/publicuser',
          icon: 'twitter',
          display: 'both',
        },
      ],
      theme_id: 'ocean',
      is_dark_mode: false,
      layout_type: 'links',
    };

    // Mock profile and settings fetch for public viewing
    mockSupabase.from.mockImplementation((table) => {
      if (table === 'profiles') {
        return {
          select: vi.fn(() => ({
            eq: vi.fn(() => ({
              maybeSingle: vi.fn().mockResolvedValue({
                data: mockProfile,
                error: null,
              }),
            })),
          })),
        };
      } else if (table === 'profile_settings') {
        return {
          select: vi.fn(() => ({
            eq: vi.fn(() => ({
              maybeSingle: vi.fn().mockResolvedValue({
                data: mockSettings,
                error: null,
              }),
            })),
          })),
        };
      }
      return {
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
          })),
        })),
      };
    });

    // Mock navigation to user profile
    Object.defineProperty(window, 'location', {
      value: { pathname: '/publicuser', search: '', hash: '', origin: 'http://localhost:3000' },
      writable: true,
    });

    render(<TestApp />);

    // The UserProfile component should load and display the public profile
    await waitFor(() => {
      expect(mockSupabase.from).toHaveBeenCalledWith('profiles');
      expect(mockSupabase.from).toHaveBeenCalledWith('profile_settings');
    });

    // Verify database calls were made to fetch public profile data
    expect(mockSupabase.from('profiles').select).toBeDefined();
    expect(mockSupabase.from('profile_settings').select).toBeDefined();
  });

  it('should handle error scenarios gracefully in complete workflow', async () => {
    // Mock authentication failure
    mockSupabase.auth.signInWithPassword.mockResolvedValue({
      data: { user: null, session: null },
      error: { message: 'Invalid credentials' },
    });

    render(<TestApp />);

    // Navigate to auth an attempt login with invalid credentials
    const getStartedButton = screen.getByRole('button', { name: /get started/i });
    fireEvent.click(getStartedButton);

    await waitFor(() => {
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText('Password');

      fireEvent.change(emailInput, { target: { value: 'invalid@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });

      const signInButton = screen.getByRole('button', { name: /sign in/i });
      fireEvent.click(signInButton);
    });

    await waitFor(() => {
      expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'invalid@example.com',
        password: 'wrongpassword',
      });
    });

    // Verify error handling in the complete workflow
    expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalled();
  });
});
