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

    // Use getAll because of duplicates in drawer
    expect(screen.getAllByText(/pickup/i)[0]).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /dashboard/i })[0]).toBeInTheDocument();
    expect(screen.queryByText(/log in/i)).not.toBeInTheDocument();
  });

  it('renders unauthenticated state correctly', () => {
    mockUseUser.mockReturnValue({ data: null });
    render(<HomeHeader />);

    // Check for duplicates due to mobile drawer
    expect(screen.getAllByText(/pickup/i)[0]).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /log in/i })[0]).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /sign up/i })[0]).toBeInTheDocument();
  });

  it('navigates to login on click', async () => {
    mockUseUser.mockReturnValue({ data: null }); // Ensure unauthenticated
    const user = userEvent.setup();
    render(<HomeHeader />);

    await user.click(screen.getByRole('button', { name: /log in/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('navigates to dashboard on click', async () => {
    mockUseUser.mockReturnValue({ data: { firstName: 'John' } });
    const user = userEvent.setup();
    render(<HomeHeader />);

    // Note: Desktop view will show the button directly.
    // We are not easily simulating viewport in jsdom without layout mocks,
    // but we can check if the elements exist in the DOM structure.
    await user.click(screen.getByRole('button', { name: /dashboard/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });

  it('toggles mobile drawer and navigates', async () => {
    mockUseUser.mockReturnValue({ data: null });
    const user = userEvent.setup();
    render(<HomeHeader />);

    // Open Drawer
    // Note: In tests, both desktop and mobile elements might be in DOM if hidden with CSS.
    // Button is hidden with CSS { display: sm: none }
    // Since IconButton wraps MenuIcon, finding by TestId of icon usually works if icon has it,
    // otherwise getByRole('button', { name: /open drawer/i })
    const drawerButton = screen.getByRole('button', { name: /open drawer/i });

    await user.click(drawerButton);

    // Click Login in Drawer
    // Drawer content is now mounted (or temporary drawer logic).
    // We might have duplicate "Log In" buttons (one desktop hidden, one drawer visible).
    const loginButtons = screen.getAllByText(/log in/i);
    // Usually the last one is the drawer one if rendered later, or we check visibility.
    // For simple navigation check, clicking either is fine in logic, but let's try to be specific if possible.
    // Actually, just ensuring we can click one of them to navigate is sufficient for logic verification.
    await user.click(loginButtons[loginButtons.length - 1]);

    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});
