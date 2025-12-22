import { render, screen } from '@/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import { HomeHeader } from './HomeHeader';
import { useUser, useLogout } from '@hooks/useAuth';
import { useNavigate } from 'react-router-dom';

// Mock dependencies
vi.mock('@hooks/useAuth');
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

describe('HomeHeader', () => {
  const mockNavigate = vi.fn();
  const mockUseUser = useUser as unknown as ReturnType<typeof vi.fn>;
  const mockUseLogout = useLogout as unknown as ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    (useNavigate as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockNavigate);
    mockUseLogout.mockReturnValue({ mutate: vi.fn() });
  });

  it('renders authenticated state correctly', () => {
    mockUseUser.mockReturnValue({ data: { user: { firstName: 'John', lastName: 'Doe' } } });
    render(<HomeHeader />);

    // Use getAll because of duplicates in drawer
    expect(screen.getAllByText(/pickup/i)[0]).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /dashboard/i })[0]).toBeInTheDocument();
  });

  it('renders unauthenticated state correctly', () => {
    mockUseUser.mockReturnValue({ data: null });
    render(<HomeHeader />);

    // Check for duplicates due to mobile drawer
    expect(screen.getAllByText(/pickup/i)[0]).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /log in/i })[0]).toBeInTheDocument();
    // Note: The signup button says "Get Started" not "Sign Up" in the desktop nav
    expect(screen.getAllByRole('button', { name: /get started/i })[0]).toBeInTheDocument();
  });

  it('navigates to login on click', async () => {
    mockUseUser.mockReturnValue({ data: null }); // Ensure unauthenticated
    const user = userEvent.setup();
    render(<HomeHeader />);

    await user.click(screen.getAllByRole('button', { name: /log in/i })[0]);
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('navigates to dashboard on click', async () => {
    mockUseUser.mockReturnValue({ data: { user: { firstName: 'John', lastName: 'Doe' } } });
    const user = userEvent.setup();
    render(<HomeHeader />);

    // Note: Desktop view will show the button directly.
    await user.click(screen.getAllByRole('button', { name: /dashboard/i })[0]);
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });

  it('shows user avatar when authenticated', () => {
    mockUseUser.mockReturnValue({ data: { user: { firstName: 'John', lastName: 'Doe' } } });
    render(<HomeHeader />);

    // Check for user initials in avatar
    expect(screen.getByText('JD')).toBeInTheDocument();
  });
});
