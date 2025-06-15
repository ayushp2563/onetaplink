
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Navbar from '../components/Navbar';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';

// Mock AuthProvider
vi.mock('@/components/AuthProvider', () => ({
  useAuth: () => ({
    session: { user: { id: 'test-user-id' } },
    user: { id: 'test-user-id' },
    loading: false,
    signOut: vi.fn(),
  }),
}));

// Mock theme provider
vi.mock('@/components/theme-provider', () => ({
  useTheme: () => ({
    theme: 'light',
    setTheme: vi.fn(),
  }),
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('Navbar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders navigation links', () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('shows user menu when authenticated', () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    const avatarButton = screen.getByRole('button');
    fireEvent.click(avatarButton);
    
    expect(screen.getByText('Sign Out')).toBeInTheDocument();
  });

  it('handles sign out', () => {
    const mockSignOut = vi.fn();
    vi.mocked(require('@/components/AuthProvider').useAuth).mockReturnValue({
      session: { user: { id: 'test-user-id' } },
      user: { id: 'test-user-id' },
      loading: false,
      signOut: mockSignOut,
    });

    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    const avatarButton = screen.getByRole('button');
    fireEvent.click(avatarButton);
    
    const signOutButton = screen.getByText('Sign Out');
    fireEvent.click(signOutButton);
    
    expect(mockSignOut).toHaveBeenCalled();
  });
});
