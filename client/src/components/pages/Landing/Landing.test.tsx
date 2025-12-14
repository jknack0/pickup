import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { Landing } from './Landing';
import { useNavigate } from 'react-router-dom';

// Mock HomeLayout to avoid full rendering of children that might rely on context
vi.mock('@templates/HomeLayout', () => ({
  HomeLayout: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="home-layout">{children}</div>
  ),
}));

vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
}));

// Mock Assets
vi.mock('@assets/payment-feature.png', () => ({ default: 'payment.png' }));
vi.mock('@assets/teams-feature.png', () => ({ default: 'teams.png' }));
vi.mock('@assets/facility-feature.png', () => ({ default: 'facility.png' }));

describe('Landing Page', () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useNavigate as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockNavigate);
  });

  it('renders hero section', () => {
    render(<Landing />);
    expect(screen.getByText(/organize pickup games/i)).toBeInTheDocument();
    expect(screen.getByText(/like a pro/i)).toBeInTheDocument();
    expect(screen.getAllByText(/get started/i).length).toBeGreaterThan(0);
  });

  it('renders features', () => {
    render(<Landing />);
    expect(screen.getByText(/easy payments/i)).toBeInTheDocument();
    expect(screen.getByText(/group events/i)).toBeInTheDocument();
    expect(screen.getByText(/find & rent courts/i)).toBeInTheDocument();
  });

  it('navigates to signup on CTA click', async () => {
    const user = userEvent.setup();
    render(<Landing />);

    // There are multiple "Get Started" / "Sign Up" buttons, grab the first one
    const ctatBtns = screen.getAllByText(/get started/i);
    await user.click(ctatBtns[0]);

    expect(mockNavigate).toHaveBeenCalledWith('/signup');
  });

  it('navigates to login on CTA click', async () => {
    const user = userEvent.setup();
    render(<Landing />);

    const loginBtn = screen.getByRole('button', { name: /log in/i });
    await user.click(loginBtn);

    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});
