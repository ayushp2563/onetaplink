
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DynamicIcon } from '../components/DynamicIcon';
import { vi } from 'vitest';

// Match the keys in ICON_MAP (lowercase for actual lucide icons)
vi.mock('lucide-react', () => ({
  // Only lowercase are mapped in DynamicIcon's ICON_MAP
  user: ({ className }: { className?: string }) => <div className={className} data-testid="user-icon">User Icon</div>,
  mail: ({ className }: { className?: string }) => <div className={className} data-testid="mail-icon">Mail Icon</div>,
  link: ({ className }: { className?: string }) => <div className={className} data-testid="link-icon">Link Icon</div>,
  // Add a fake 'home' icon for coverage
  home: ({ className }: { className?: string }) => <div className={className} data-testid="home-icon">Home Icon</div>,
}));

describe('DynamicIcon', () => {
  it('renders specified icon', () => {
    render(<DynamicIcon name="user" className="w-4 h-4" />);
    expect(screen.getByTestId('user-icon')).toBeInTheDocument();
    expect(screen.getByText('User Icon')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<DynamicIcon name="user" className="w-8 h-8 text-blue-500" />);
    const icon = screen.getByTestId('user-icon');
    expect(icon).toHaveClass('w-8', 'h-8', 'text-blue-500');
  });

  it('falls back to Link icon for unknown names', () => {
    render(<DynamicIcon name="unknownIcon" className="w-4 h-4" />);
    expect(screen.getByTestId('link-icon')).toBeInTheDocument();
  });

  it('handles empty icon name', () => {
    render(<DynamicIcon name="" className="w-4 h-4" />);
    expect(screen.getByTestId('link-icon')).toBeInTheDocument();
  });
});
