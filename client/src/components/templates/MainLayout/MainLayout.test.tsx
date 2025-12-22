import { render, screen, waitFor } from '@/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MainLayout } from './MainLayout';
import userEvent from '@testing-library/user-event';
import { useLogout, useUser } from '@hooks/useAuth';
import { useMyEvents } from '@hooks/useEvents';

// Mock hooks (but NOT react-router-dom - let test-utils MemoryRouter handle routing)
vi.mock('@hooks/useAuth');
vi.mock('@hooks/useEvents');

describe('MainLayout', () => {
  const mockLogoutMutate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useLogout as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      mutate: mockLogoutMutate,
    });
    (useMyEvents as unknown as ReturnType<typeof vi.fn>).mockReturnValue({ data: [] });
    (useUser as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      data: {
        user: {
          firstName: 'Test',
          lastName: 'User',
          email: 'test@example.com',
        },
      },
    });
  });

  it('renders children correctly', () => {
    render(
      <MainLayout>
        <div data-testid="test-child">Child Content</div>
      </MainLayout>,
    );
    expect(screen.getByTestId('test-child')).toBeInTheDocument();
  });

  it('renders the header title', () => {
    render(
      <MainLayout>
        <div>Content</div>
      </MainLayout>,
    );
    expect(screen.getAllByText('Pickup')[0]).toBeInTheDocument();
  });

  it('renders sidebar items', () => {
    render(
      <MainLayout>
        <div>Content</div>
      </MainLayout>,
    );
    // Since we render two drawers (mobile/desktop), we expect duplicate text
    expect(screen.getAllByText('Dashboard')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Events')[0]).toBeInTheDocument();
    // User name is shown in the sidebar
    expect(screen.getAllByText('Test User')[0]).toBeInTheDocument();
  });

  it('renders user avatar in sidebar', () => {
    render(
      <MainLayout>
        <div>Content</div>
      </MainLayout>,
    );

    // Check for user initials "TU" in the avatar
    expect(screen.getAllByText('TU')[0]).toBeInTheDocument();
  });

  it('toggles events section and lists events', async () => {
    // Mock events data
    (useMyEvents as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      data: [
        { _id: '1', title: 'Volleyball Game' },
        { _id: '2', title: 'Basketball Meetup' },
      ],
    });

    const user = userEvent.setup();
    render(
      <MainLayout>
        <div>Content</div>
      </MainLayout>,
    );

    // Initial state: Events section is open (default true)
    // Check for existence in either drawer
    expect(screen.getAllByText('Volleyball Game')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Basketball Meetup')[0]).toBeInTheDocument();

    // Click Events to toggle (close)
    const eventsButtons = screen.getAllByText('Events');
    await user.click(eventsButtons[0]);

    // After toggle, events should not be visible
    await waitFor(() => {
      expect(screen.queryByText('Volleyball Game')).not.toBeInTheDocument();
    });
  });
});
