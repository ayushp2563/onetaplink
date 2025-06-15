
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DashboardHeader } from '../components/DashboardHeader';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
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
