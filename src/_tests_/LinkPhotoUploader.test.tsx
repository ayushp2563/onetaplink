
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import LinkPhotoUploader from '../components/LinkPhotoUploader';
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
  onPhotoUploaded: vi.fn(),
  linkId: 'test-link-id',
  currentPhotoUrl: null,
};

describe('LinkPhotoUploader', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders upload button', () => {
    render(<LinkPhotoUploader {...mockProps} />);
    
    expect(screen.getByText('Upload Photo')).toBeInTheDocument();
  });

  it('shows current photo when provided', () => {
    const propsWithPhoto = {
      ...mockProps,
      currentPhotoUrl: 'https://example.com/photo.jpg',
    };
    
    render(<LinkPhotoUploader {...propsWithPhoto} />);
    
    const photoImage = screen.getByAltText('Link photo');
    expect(photoImage).toBeInTheDocument();
    expect(photoImage).toHaveAttribute('src', 'https://example.com/photo.jpg');
  });

  it('handles file selection', () => {
    render(<LinkPhotoUploader {...mockProps} />);
    
    const fileInput = screen.getByDisplayValue('');
    const file = new File(['test'], 'photo.jpg', { type: 'image/jpeg' });
    
    fireEvent.change(fileInput, { target: { files: [file] } });
    
    expect(fileInput.files).toHaveLength(1);
    expect(fileInput.files?.[0]).toBe(file);
  });

  it('shows uploading state', async () => {
    render(<LinkPhotoUploader {...mockProps} />);
    
    const fileInput = screen.getByDisplayValue('');
    const file = new File(['test'], 'photo.jpg', { type: 'image/jpeg' });
    
    fireEvent.change(fileInput, { target: { files: [file] } });
    
    await waitFor(() => {
      expect(screen.getByText('Uploading...')).toBeInTheDocument();
    });
  });

  it('can remove current photo', () => {
    const propsWithPhoto = {
      ...mockProps,
      currentPhotoUrl: 'https://example.com/photo.jpg',
    };
    
    render(<LinkPhotoUploader {...propsWithPhoto} />);
    
    const removeButton = screen.getByText('Remove Photo');
    fireEvent.click(removeButton);
    
    expect(mockProps.onPhotoUploaded).toHaveBeenCalledWith('');
  });
});
