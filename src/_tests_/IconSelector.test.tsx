
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { IconSelector } from '../components/IconSelector';
import { vi } from 'vitest';

const mockOnSelectIcon = vi.fn();

describe('IconSelector', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders icon grid', () => {
    render(<IconSelector onSelectIcon={mockOnSelectIcon} selectedIcon="" />);
    
    expect(screen.getByText('Select an Icon')).toBeInTheDocument();
    expect(screen.getByTitle('link')).toBeInTheDocument();
    expect(screen.getByTitle('home')).toBeInTheDocument();
  });

  it('calls onSelectIcon when icon is clicked', () => {
    render(<IconSelector onSelectIcon={mockOnSelectIcon} selectedIcon="" />);
    
    const linkIcon = screen.getByTitle('link');
    if (linkIcon) {
      fireEvent.click(linkIcon);
      expect(mockOnSelectIcon).toHaveBeenCalledWith('link');
    }
  });

  it('highlights selected icon', () => {
    render(<IconSelector onSelectIcon={mockOnSelectIcon} selectedIcon="home" />);
    
    const homeIconButton = screen.getByTitle('home');
    expect(homeIconButton).toHaveClass('bg-primary');
  });

  it('shows search functionality', () => {
    render(<IconSelector onSelectIcon={mockOnSelectIcon} selectedIcon="" />);
    
    const searchInput = screen.getByPlaceholderText('Search icons...');
    expect(searchInput).toBeInTheDocument();
    
    fireEvent.change(searchInput, { target: { value: 'home' } });
    expect(screen.getByTitle('home')).toBeInTheDocument();
  });
});
