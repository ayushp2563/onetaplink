
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DynamicIcon } from '../components/DynamicIcon';
import { vi } from 'vitest';

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  Link: ({ className }: any) => <div className={className} data-testid="link-icon">Link Icon</div>,
  Home: ({ className }: any) => <div className={className} data-testid="home-icon">Home Icon</div>,
  User: ({ className }: any) => <div className={className} data-testid="user-icon">User Icon</div>,
  Mail: ({ className }: any) => <div className={className} data-testid="mail-icon">Mail Icon</div>,
}));

describe('DynamicIcon', () => {
  it('renders specified icon', () => {
    render(<DynamicIcon name="Home" className="w-4 h-4" />);
    
    expect(screen.getByTestId('home-icon')).toBeInTheDocument();
    expect(screen.getByText('Home Icon')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<DynamicIcon name="User" className="w-8 h-8 text-blue-500" />);
    
    const icon = screen.getByTestId('user-icon');
    expect(icon).toHaveClass('w-8', 'h-8', 'text-blue-500');
  });

  it('falls back to Link icon for unknown names', () => {
    render(<DynamicIcon name="UnknownIcon" className="w-4 h-4" />);
    
    expect(screen.getByTestId('link-icon')).toBeInTheDocument();
  });

  it('handles empty icon name', () => {
    render(<DynamicIcon name="" className="w-4 h-4" />);
    
    expect(screen.getByTestId('link-icon')).toBeInTheDocument();
  });
});
