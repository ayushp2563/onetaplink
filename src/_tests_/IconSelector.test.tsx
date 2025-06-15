import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { IconSelector } from '../components/IconSelector';
import { vi } from 'vitest';

vi.mock('@/components/ui/popover', () => ({
    Popover: ({ children }: React.PropsWithChildren<unknown>) => <div>{children}</div>,
    PopoverContent: ({ children }: React.PropsWithChildren<unknown>) => <div>{children}</div>,
    PopoverTrigger: ({ children }: React.PropsWithChildren<object>) => <div>{children}</div>,
}));
vi.mock('@/components/ui/button', () => ({
    Button: ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => <button {...props}>{children}</button>,
}));
vi.mock('@/components/ui/input', () => ({
    Input: ({ ...props }: React.InputHTMLAttributes<HTMLInputElement>) => <input {...props} />,
}));
vi.mock('@/components/ui/scroll-area', () => ({
    ScrollArea: ({ children }: React.PropsWithChildren<unknown>) => <div>{children}</div>,
}));

const mockOnSelectIcon = vi.fn();

describe('IconSelector', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  function openPopover() {
    // Click the trigger button (button with aria-label="Select icon")
    const triggerBtn = screen.getByRole('button', { name: 'Select icon' });
    fireEvent.click(triggerBtn);
  }

  it('renders icon grid', () => {
    render(<IconSelector onSelectIcon={mockOnSelectIcon} selectedIcon="" />);
    openPopover();
    expect(screen.getByText('Select an Icon')).toBeInTheDocument();
    expect(screen.getByTitle('link')).toBeInTheDocument();
    expect(screen.getByTitle('user')).toBeInTheDocument();
  });

  it('calls onSelectIcon when icon is clicked', () => {
    render(<IconSelector onSelectIcon={mockOnSelectIcon} selectedIcon="" />);
    openPopover();
    const linkIcon = screen.getByTitle('link');
    fireEvent.click(linkIcon);
    expect(mockOnSelectIcon).toHaveBeenCalledWith('link');
  });

  it('highlights selected icon', () => {
    render(<IconSelector onSelectIcon={mockOnSelectIcon} selectedIcon="user" />);
    openPopover();
    const userIconButton = screen.getByTitle('user');
    expect(userIconButton).toHaveClass('bg-primary');
  });

  it('shows search functionality', () => {
    render(<IconSelector onSelectIcon={mockOnSelectIcon} selectedIcon="" />);
    openPopover();
    const searchInput = screen.getByPlaceholderText('Search icons...');
    expect(searchInput).toBeInTheDocument();
    fireEvent.change(searchInput, { target: { value: 'user' } });
    expect(screen.getByTitle('user')).toBeInTheDocument();
  });
});
