
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import LinkEditorPage from '../pages/LinkEditorPage';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';

// Mock dependencies
vi.mock('@/integrations/supabase/client', () => import('../../__mocks__/supabase'));
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));
vi.mock('@/hooks/usePageMetadata', () => ({
  usePageMetadata: vi.fn(),
}));

// Mock LinkEditor (should be default)
vi.mock('@/components/LinkEditor', () => ({
  __esModule: true,
  default: () => <div data-testid="link-editor">Link Editor Component</div>,
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('LinkEditorPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows loading state initially', () => {
    render(
      <BrowserRouter>
        <LinkEditorPage />
      </BrowserRouter>
    );
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders page content when authorized', async () => {
    render(
      <BrowserRouter>
        <LinkEditorPage />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByText('Edit Your Links')).toBeInTheDocument();
      expect(screen.getByText('Add, edit, or remove links that will appear on your profile')).toBeInTheDocument();
      expect(screen.getByTestId('link-editor')).toBeInTheDocument();
    });
  });

  it('has back to dashboard button', async () => {
    render(
      <BrowserRouter>
        <LinkEditorPage />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByText('Back to Dashboard')).toBeInTheDocument();
    });
  });
});
