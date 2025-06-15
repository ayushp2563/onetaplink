
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import LinkEditor from '../components/LinkEditor';
import { vi } from 'vitest';

// --- MOCK window.matchMedia for JSDOM tests ---
if (!window.matchMedia) {
  window.matchMedia = vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    dispatchEvent: vi.fn(),
  }));
}

// Patch named export for IconSelector and LinkPhotoUploader
vi.mock('@/components/IconSelector', () => ({
  IconSelector: ({ onSelectIcon }: { onSelectIcon: (icon: string) => void }) => (
    <button onClick={() => onSelectIcon('test-icon')}>Icon Selector</button>
  ),
  __esModule: true,
}));
vi.mock('@/components/LinkPhotoUploader', () => ({
  LinkPhotoUploader: ({ onPhotoUploaded }: { onPhotoUploaded: (url: string) => void }) => (
    <button onClick={() => onPhotoUploaded('test-photo.jpg')}>Photo Uploader</button>
  ),
  __esModule: true,
}));
vi.mock('@/integrations/supabase/client', () => import('../../__mocks__/supabase'));
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));
vi.mock('@/components/ui/button', () => ({
  Button: ({ children, ...props }: React.PropsWithChildren<React.ButtonHTMLAttributes<HTMLButtonElement>>) => <button {...props}>{children}</button>,
}));
vi.mock('@/components/ui/input', () => ({
  Input: ({ ...props }: React.InputHTMLAttributes<HTMLInputElement>) => <input {...props} />,
}));

describe('LinkEditor', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders add link button', () => {
    render(<LinkEditor />);
    expect(screen.getByText('Add New Link')).toBeInTheDocument();
  });

  it('shows loading state initially', () => {
    render(<LinkEditor />);
    expect(screen.getByText('Loading links...')).toBeInTheDocument();
  });

  it('can add a new link', async () => {
    render(<LinkEditor />);
    await waitFor(() => {
      const addButton = screen.getByText('Add New Link');
      fireEvent.click(addButton);
    });
    expect(screen.getByPlaceholderText('Link title')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('https://example.com')).toBeInTheDocument();
  });

  it('can save a link', async () => {
    render(<LinkEditor />);
    await waitFor(() => {
      const addButton = screen.getByText('Add New Link');
      fireEvent.click(addButton);
    });
    const titleInput = screen.getByPlaceholderText('Link title');
    const urlInput = screen.getByPlaceholderText('https://example.com');
    fireEvent.change(titleInput, { target: { value: 'Test Link' } });
    fireEvent.change(urlInput, { target: { value: 'https://test.com' } });
    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);
    await waitFor(() => {
      expect(screen.queryByText('Save')).not.toBeInTheDocument();
    });
  });
});

