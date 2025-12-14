import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import { HomeHeader } from './HomeHeader';
import { useUser } from '@hooks/useAuth';
import { useNavigate } from 'react-router-dom';

// Mock dependencies
vi.mock('@hooks/useAuth');
vi.mock('react-router-dom');

describe('HomeHeader', () => {
  const mockNavigate = vi.fn();
  const mockUseUser = useUser as unknown as ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    (useNavigate as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockNavigate);
  });

  it('renders authenticated state correctly', () => {
    mockUseUser.mockReturnValue({ data: { name: 'John Doe' } });
    render(<HomeHeader />);

    expect(screen.getByText(/pickup/i)).toBeInTheDocument();
    expect(screen.getByText('J')).toBeInTheDocument(); // Avatar initial
    expect(screen.queryByText(/log in/i)).not.toBeInTheDocument();
  });

  it('renders unauthenticated state correctly', () => {
    mockUseUser.mockReturnValue({ data: null });
    render(<HomeHeader />);

    expect(screen.getByText(/pickup/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
  });

  it('navigates to login on click', async () => {
    mockUseUser.mockReturnValue({ data: null });
    const user = userEvent.setup();
    render(<HomeHeader />);

    await user.click(screen.getByRole('button', { name: /log in/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('navigates to dashboard on avatar click', async () => {
    mockUseUser.mockReturnValue({ data: { name: 'John Doe' } });
    const user = userEvent.setup();
    render(<HomeHeader />);

    // Click the avatar container (Box with title)
    await user.click(screen.getByTitle(/go to dashboard/i));
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });
});
