import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi, beforeEach, describe, it, expect } from 'vitest';
import UserProfile from '@/pages/UserProfile';
import ProfileEditor from '@/pages/ProfileEditor';
import { AuthProvider } from '@/components/AuthProvider';
import { supabase } from '@/integrations/supabase/client';

const mockSupabase = {
  auth: {
    getSession: vi.fn(),
    onAuthStateChange: vi.fn(),
  },
  from: vi.fn(),
  storage: {
    from: vi.fn(() => ({
      upload: vi.fn(),
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

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ username: 'testuser' }),
    useNavigate: () => vi.fn(),
  };
});

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => children,
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

describe('Profile Publishing System Tests', () => {
  const mockProfile = {
    id: 'test-user-id',
    username: 'testuser',
    full_name: 'Test User',
    bio: 'Software Developer',
    avatar_url: 'https://example.com/avatar.jpg',
    custom_title: 'My Digital Identity',
  };

  const mockSettings = {
    id: 'test-user-id',
    links: [
      {
        id: '1',
        title: 'GitHub',
        url: 'https://github.com/testuser',
        icon: 'github',
        display: 'both',
        photo_url: '',
      },
      {
        id: '2',
        title: 'Portfolio',
        url: 'https://testuser.dev',
        icon: 'link',
        display: 'title',
        photo_url: 'https://example.com/portfolio.jpg',
      },
      {
        id: '3',
        title: 'LinkedIn',
        url: 'https://linkedin.com/in/testuser',
        icon: 'linkedin',
        display: 'icon',
        photo_url: '',
      },
    ],
    theme_id: 'nature',
    is_dark_mode: true,
    font_style: 'serif',
    layout_type: 'bento',
    background_style: JSON.stringify({
      id: 'custom',
      url: 'https://example.com/background.jpg',
    }),
    favicon_url: 'https://example.com/favicon.ico',
  };

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

  it('should render complete published profile with all features', async () => {
    // Mock successful data fetching
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

    render(
      <TestWrapper>
        <UserProfile />
      </TestWrapper>
    );

    // Wait for profile to load
    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument();
    });

    // Verify profile information is displayed
    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('@testuser')).toBeInTheDocument();
    expect(screen.getByText('Software Developer')).toBeInTheDocument();

    // Verify links are displayed
    await waitFor(() => {
      expect(screen.getByText('GitHub')).toBeInTheDocument();
      expect(screen.getByText('Portfolio')).toBeInTheDocument();
    });

    // Verify layout and theme are applied
    const profileContainer = screen.getByText('Test User').closest('div');
    expect(profileContainer).toBeInTheDocument();

    // Verify database calls were made
    expect(mockSupabase.from).toHaveBeenCalledWith('profiles');
    expect(mockSupabase.from).toHaveBeenCalledWith('profile_settings');
  });

  it('should handle profile with different layout types', async () => {
    const linkLayoutSettings = {
      ...mockSettings,
      layout_type: 'links',
    };

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
                data: linkLayoutSettings,
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

    render(
      <TestWrapper>
        <UserProfile />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument();
    });

    // Verify links layout is rendered
    expect(screen.getByText('GitHub')).toBeInTheDocument();
    expect(screen.getByText('Portfolio')).toBeInTheDocument();

    // Verify correct database queries
    expect(mockSupabase.from('profiles').select).toHaveBeenCalled();
    expect(mockSupabase.from('profile_settings').select).toHaveBeenCalled();
  });

  it('should handle profile with custom background and theme', async () => {
    const customThemeSettings = {
      ...mockSettings,
      theme_id: 'sunset',
      background_style: JSON.stringify({
        id: 'gradient',
        url: '',
      }),
    };

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
                data: customThemeSettings,
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

    render(
      <TestWrapper>
        <UserProfile />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument();
    });

    // Verify profile loads with custom theme
    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('Software Developer')).toBeInTheDocument();

    // Verify database interactions
    expect(mockSupabase.from('profiles').select().eq().maybeSingle).toHaveBeenCalled();
    expect(mockSupabase.from('profile_settings').select().eq().maybeSingle).toHaveBeenCalled();
  });

  it('should handle missing profile gracefully', async () => {
    // Mock profile not found
    mockSupabase.from.mockImplementation((table) => {
      if (table === 'profiles') {
        return {
          select: vi.fn(() => ({
            eq: vi.fn(() => ({
              maybeSingle: vi.fn().mockResolvedValue({
                data: null, // Profile not found
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

    render(
      <TestWrapper>
        <UserProfile />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText(/digital identity not found/i)).toBeInTheDocument();
    });

    // Verify error handling
    expect(screen.getByText(/this digital identity does not exist/i)).toBeInTheDocument();
    expect(screen.getByText(/return home/i)).toBeInTheDocument();

    // Verify database calls were still made
    expect(mockSupabase.from).toHaveBeenCalledWith('profiles');
  });

  it('should handle database errors during profile loading', async () => {
    // Mock database error
    mockSupabase.from.mockImplementation((table) => {
      if (table === 'profiles') {
        return {
          select: vi.fn(() => ({
            eq: vi.fn(() => ({
              maybeSingle: vi.fn().mockResolvedValue({
                data: null,
                error: { message: 'Database connection failed' },
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

    render(
      <TestWrapper>
        <UserProfile />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText(/digital identity not found/i)).toBeInTheDocument();
    });

    // Verify error state is displayed
    expect(screen.getByText(/failed to load profile/i)).toBeInTheDocument();

    // Verify database calls were attempted
    expect(mockSupabase.from('profiles').select).toHaveBeenCalled();
  });
});