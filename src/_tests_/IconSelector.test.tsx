
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import IconSelector from '../components/IconSelector';
import { vi } from 'vitest';

// Mock DynamicIcon component
vi.mock('@/components/DynamicIcon', () => ({
  default: ({ name, className }: { name: string; className?: string }) => (
    <div className={className} data-testid={`icon-${name.toLowerCase()}`}>
      {name} Icon
    </div>
  ),
}));

const mockOnIconSelect = vi.fn();

describe('IconSelector', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders icon grid', () => {
    render(<IconSelector onIconSelect={mockOnIconSelect} />);
    
    expect(screen.getByText('Select an Icon')).toBeInTheDocument();
    expect(screen.getByTestId('icon-link')).toBeInTheDocument();
    expect(screen.getByTestId('icon-home')).toBeInTheDocument();
  });

  it('calls onIconSelect when icon is clicked', () => {
    render(<IconSelector onIconSelect={mockOnIconSelect} />);
    
    const linkIcon = screen.getByTestId('icon-link').closest('button');
    if (linkIcon) {
      fireEvent.click(linkIcon);
      expect(mockOnIconSelect).toHaveBeenCalledWith('Link');
    }
  });

  it('highlights selected icon', () => {
    render(<IconSelector onIconSelect={mockOnIconSelect} selectedIcon="Home" />);
    
    const homeIconButton = screen.getByTestId('icon-home').closest('button');
    expect(homeIconButton).toHaveClass('bg-primary');
  });

  it('shows search functionality', () => {
    render(<IconSelector onIconSelect={mockOnIconSelect} />);
    
    const searchInput = screen.getByPlaceholderText('Search icons...');
    expect(searchInput).toBeInTheDocument();
    
    fireEvent.change(searchInput, { target: { value: 'home' } });
    expect(screen.getByTestId('icon-home')).toBeInTheDocument();
  });
});
