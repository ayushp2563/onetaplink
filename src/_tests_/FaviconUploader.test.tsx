
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
    // find file input by label text directly
    const fileInput = screen.getByLabelText('Upload Favicon') as HTMLInputElement;
    const file = new File(['test'], 'favicon.ico', { type: 'image/x-icon' });
    fireEvent.change(fileInput, { target: { files: [file] } });
    expect(fileInput.files).toHaveLength(1);
    expect(fileInput.files?.[0]).toBe(file);
  });

  it('shows uploading state', async () => {
    render(<FaviconUploader {...mockProps} />);
    const fileInput = screen.getByLabelText('Upload Favicon') as HTMLInputElement;
    const file = new File(['test'], 'favicon.ico', { type: 'image/x-icon' });
    fireEvent.change(fileInput, { target: { files: [file] } });
    await waitFor(() => {
      expect(screen.getByText('Uploading...')).toBeInTheDocument();
    });
  });
});
