
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
    expect(screen.getByTitle('user')).toBeInTheDocument();
  });

  it('calls onSelectIcon when icon is clicked', () => {
    render(<IconSelector onSelectIcon={mockOnSelectIcon} selectedIcon="" />);
    const linkIcon = screen.getByTitle('link');
    fireEvent.click(linkIcon);
    expect(mockOnSelectIcon).toHaveBeenCalledWith('link');
  });

  it('highlights selected icon', () => {
    render(<IconSelector onSelectIcon={mockOnSelectIcon} selectedIcon="user" />);
    const userIconButton = screen.getByTitle('user');
    expect(userIconButton).toHaveClass('bg-primary');
  });

  it('shows search functionality', () => {
    render(<IconSelector onSelectIcon={mockOnSelectIcon} selectedIcon="" />);
    const searchInput = screen.getByPlaceholderText('Search icons...');
    expect(searchInput).toBeInTheDocument();
    fireEvent.change(searchInput, { target: { value: 'user' } });
    expect(screen.getByTitle('user')).toBeInTheDocument();
  });
});
