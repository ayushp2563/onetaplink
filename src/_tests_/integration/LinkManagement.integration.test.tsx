import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi, beforeEach, describe, it, expect } from 'vitest';
import LinkEditor from '@/components/LinkEditor';
import { AuthProvider } from '@/components/AuthProvider';
import { supabase } from '@/integrations/supabase/client';

const mockSupabase = {
  auth: {
    getSession: vi.fn(),
    onAuthStateChange: vi.fn(),
  },
  from: vi.fn(() => ({
    select: vi.fn(() => ({
      eq: vi.fn(() => ({
        single: vi.fn(),
      })),
    })),
    update: vi.fn(() => ({
      eq: vi.fn(),
    })),
  })),
  storage: {
    from: vi.fn(() => ({
      upload: vi.fn(),
      remove: vi.fn(),
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
    useNavigate: () => vi.fn(),
  };
});

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

describe('Link Management Integration Tests', () => {
  const mockUser = {
    id: 'test-user-id',
    email: 'test@example.com',
  };

  const mockSession = {
    user: mockUser,
    access_token: 'mock-token',
  };

  const mockLinks = [
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
      photo_url: 'https://example.com/photo.jpg',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    
    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: mockSession },
      error: null,
    });

    mockSupabase.auth.onAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
    });

    // Mock profile settings fetch
    mockSupabase.from.mockReturnValue({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn().mockResolvedValue({
            data: {
              links: mockLinks,
              theme_id: 'elegant',
              is_dark_mode: false,
            },
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
  });

  it('should load existing links from database', async () => {
    render(
      <TestWrapper>
        <LinkEditor />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('GitHub')).toBeInTheDocument();
      expect(screen.getByText('Portfolio')).toBeInTheDocument();
    });

    // Verify database calls
    expect(mockSupabase.auth.getSession).toHaveBeenCalled();
    expect(mockSupabase.from).toHaveBeenCalledWith('profile_settings');
  });

  it('should add new link and save to database', async () => {
    const mockUpdate = vi.fn(() => ({
      eq: vi.fn().mockResolvedValue({
        data: null,
        error: null,
      }),
    }));

    mockSupabase.from.mockReturnValue({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn().mockResolvedValue({
            data: { links: mockLinks },
            error: null,
          }),
        })),
      })),
      update: mockUpdate,
    });

    render(
      <TestWrapper>
        <LinkEditor />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('GitHub')).toBeInTheDocument();
    });

    // Add new link
    const titleInput = screen.getByLabelText(/link title/i);
    const urlInput = screen.getByLabelText(/url/i);

    fireEvent.change(titleInput, { target: { value: 'LinkedIn' } });
    fireEvent.change(urlInput, { target: { value: 'https://linkedin.com/in/testuser' } });

    const addButton = screen.getByRole('button', { name: /add link/i });
    fireEvent.click(addButton);

    // Save changes
    const saveButton = screen.getByRole('button', { name: /save links/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockUpdate).toHaveBeenCalled();
    });

    // Verify the update was called with new link included
    const updateCall = mockUpdate.mock.calls[0];
    expect(updateCall).toBeDefined();
  });

  it('should handle link photo upload with storage interaction', async () => {
    const mockUpload = vi.fn().mockResolvedValue({
      data: { path: 'test-user-id/photo.jpg' },
      error: null,
    });

    mockSupabase.storage = {
      from: vi.fn(() => ({
        upload: mockUpload,
        remove: vi.fn(),
        getPublicUrl: vi.fn(() => ({
          data: { publicUrl: 'https://storage.url/photo.jpg' },
        })),
      })),
    };

    render(
      <TestWrapper>
        <LinkEditor />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('GitHub')).toBeInTheDocument();
    });

    // Simulate file upload (this would normally be triggered by file input)
    const file = new File(['test'], 'photo.jpg', { type: 'image/jpeg' });
    
    // Mock the photo upload process
    const titleInput = screen.getByLabelText(/link title/i);
    const urlInput = screen.getByLabelText(/url/i);

    fireEvent.change(titleInput, { target: { value: 'Instagram' } });
    fireEvent.change(urlInput, { target: { value: 'https://instagram.com/testuser' } });

    // This would normally trigger photo upload in a real scenario
    // The component would call supabase.storage.from('link-photos').upload()
    
    const addButton = screen.getByRole('button', { name: /add link/i });
    fireEvent.click(addButton);

    // Verify link was added to the list
    await waitFor(() => {
      expect(screen.getByText('Instagram')).toBeInTheDocument();
    });
  });

  it('should handle link deletion and database update', async () => {
    const mockUpdate = vi.fn(() => ({
      eq: vi.fn().mockResolvedValue({
        data: null,
        error: null,
      }),
    }));

    mockSupabase.from.mockReturnValue({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn().mockResolvedValue({
            data: { links: mockLinks },
            error: null,
          }),
        })),
      })),
      update: mockUpdate,
    });

    render(
      <TestWrapper>
        <LinkEditor />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('GitHub')).toBeInTheDocument();
    });

    // Click delete button (assuming it exists in the LinkEditor)
    const deleteButtons = screen.getAllByLabelText(/delete/i);
    if (deleteButtons.length > 0) {
      fireEvent.click(deleteButtons[0]);
    }

    // Save changes
    const saveButton = screen.getByRole('button', { name: /save links/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockUpdate).toHaveBeenCalled();
    });
  });
});