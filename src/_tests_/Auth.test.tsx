
// src/_tests_/Auth.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Auth from '../pages/Auth';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';

// Mock the useAuth hook
vi.mock('@/components/AuthProvider', () => ({
  useAuth: vi.fn(() => ({
    session: null,
    user: null,
    loading: false,
    signOut: vi.fn(),
  })),
}));

vi.mock('@/integrations/supabase/client', () => import('../../__mocks__/supabase'));
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

describe('Auth', () => {
    it('renders sign in tab by default', () => {
        render(
          <BrowserRouter>
            <Auth />
          </BrowserRouter>
        );
      
        // Check that Sign In tab is present
        const signInTab = screen.getByRole('tab', { name: /sign in/i });
        expect(signInTab).toBeInTheDocument();
      
        // Also check for email input
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      });
});
