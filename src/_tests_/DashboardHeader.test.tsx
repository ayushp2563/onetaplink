import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DashboardHeader } from '../components/DashboardHeader';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';

// Mock framer-motion (div signature fix)
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>) => <div {...props}>{children}</div>,
  },
}));

// Mock custom components
vi.mock('@/components/ui/button', () => ({
  Button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
}));
vi.mock('@/components/ui/card', () => ({
  Card: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  CardHeader: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  CardTitle: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  CardDescription: ({ children, ...props }: any) => <div {...props}>{children}</div>,
}));
vi.mock('@/components/ui/avatar', () => ({
  Avatar: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  AvatarImage: ({ ...props }: any) => <img {...props} />,
  AvatarFallback: ({ children, ...props }: any) => <span {...props}>{children}</span>,
}));

const defaultProps = {
  username: 'testuser',
  fullName: 'Test User',
  avatarUrl: '',
  hasProfile: true,
};

describe('DashboardHeader', () => {
  it('renders welcome message with full name', () => {
    render(
      <BrowserRouter>
        <DashboardHeader {...defaultProps} />
      </BrowserRouter>
    );
    expect(screen.getByText(/Welcome back, Test User!/)).toBeInTheDocument();
  });

  it('renders username when available', () => {
    render(
      <BrowserRouter>
        <DashboardHeader {...defaultProps} />
      </BrowserRouter>
    );
    expect(screen.getByText('@testuser')).toBeInTheDocument();
  });

  it('handles missing full name', () => {
    const props = { ...defaultProps, fullName: '' };
    render(
      <BrowserRouter>
        <DashboardHeader {...props} />
      </BrowserRouter>
    );
    expect(screen.getByText(/Welcome back!/)).toBeInTheDocument();
  });

  it('shows create profile message when no profile exists', () => {
    const props = { ...defaultProps, hasProfile: false, username: '' };
    render(
      <BrowserRouter>
        <DashboardHeader {...props} />
      </BrowserRouter>
    );
    expect(screen.getByText(/Get started by creating your profile/)).toBeInTheDocument();
  });
});
