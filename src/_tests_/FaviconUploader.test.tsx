
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import FaviconUploader from '../components/FaviconUploader';
import { vi } from 'vitest';

// Mock Supabase
vi.mock('@/integrations/supabase/client', () => import('../../__mocks__/supabase'));
// Mock sonner
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const mockProps = {
  userId: 'test-user-id',
  currentFavicon: null,
  onFaviconUpload: vi.fn(),
};

describe('FaviconUploader', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders upload button', () => {
    render(<FaviconUploader {...mockProps} />);
    // The visible button's text is "Upload Favicon"
    expect(screen.getByText('Upload Favicon')).toBeInTheDocument();
    expect(screen.getByText(/Recommended: Upload a square image/)).toBeInTheDocument();
  });

  it('shows current favicon when provided', () => {
    const propsWithFavicon = { ...mockProps, currentFavicon: 'https://example.com/favicon.ico' };
    render(<FaviconUploader {...propsWithFavicon} />);
    const faviconImage = screen.getByAltText('Current favicon');
    expect(faviconImage).toBeInTheDocument();
    expect(faviconImage).toHaveAttribute('src', 'https://example.com/favicon.ico');
  });

  it('handles file input change', () => {
    render(<FaviconUploader {...mockProps} />);
    // The file input is hidden but is a child of the button, find it by label text
    // Instead, since it's not a real label, find the input in the DOM via querySelector
    const uploadBtn = screen.getByText('Upload Favicon').closest('button');
    // the file input should be inside the button, find input element
    const fileInput = uploadBtn?.querySelector('input[type="file"]') as HTMLInputElement;
    expect(fileInput).toBeInTheDocument();
    const file = new File(['test'], 'favicon.ico', { type: 'image/x-icon' });
    fireEvent.change(fileInput, { target: { files: [file] } });
    expect(fileInput.files).toHaveLength(1);
    expect(fileInput.files?.[0]).toBe(file);
  });

  it('shows uploading state', async () => {
    render(<FaviconUploader {...mockProps} />);
    const uploadBtn = screen.getByText('Upload Favicon').closest('button');
    const fileInput = uploadBtn?.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(['test'], 'favicon.ico', { type: 'image/x-icon' });
    fireEvent.change(fileInput, { target: { files: [file] } });
    await waitFor(() => {
      expect(screen.getByText('Uploading...')).toBeInTheDocument();
    });
  });
});
