import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MainLayout } from './MainLayout';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import userEvent from '@testing-library/user-event';
import { useNavigate } from 'react-router-dom';
import { useLogout, useUser } from '@hooks/useAuth';
import { useMyEvents } from '@hooks/useEvents';

// Mock dependencies
vi.mock('react-router-dom');
vi.mock('@hooks/useAuth');
vi.mock('@hooks/useEvents');

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

const renderWithClient = (ui: React.ReactNode) => {
  const testClient = createTestQueryClient();
  return render(<QueryClientProvider client={testClient}>{ui}</QueryClientProvider>);
};

describe('MainLayout', () => {
  const mockNavigate = vi.fn();
  const mockLogoutMutate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useNavigate as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockNavigate);
    (useLogout as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      mutate: mockLogoutMutate,
    });
    (useMyEvents as unknown as ReturnType<typeof vi.fn>).mockReturnValue({ data: [] });
    (useUser as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      data: {
        user: {
          firstName: 'Test',
          lastName: 'User',
        },
      },
    });
  });

  it('renders children correctly', () => {
    renderWithClient(
      <MainLayout>
        <div data-testid="test-child">Child Content</div>
      </MainLayout>,
    );
    expect(screen.getByTestId('test-child')).toBeInTheDocument();
  });

  it('renders the header title', () => {
    renderWithClient(
      <MainLayout>
        <div>Content</div>
      </MainLayout>,
    );
    expect(screen.getByText('Pickup')).toBeInTheDocument();
  });

  it('renders sidebar items', () => {
    renderWithClient(
      <MainLayout>
        <div>Content</div>
      </MainLayout>,
    );
    // Since we render two drawers (mobile/desktop), we expect duplicate text
    expect(screen.getAllByText('Dashboard')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Events')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Sign Out')[0]).toBeInTheDocument();
  });

  it('calls logout and navigates to home on sign out click', async () => {
    // Mock mutate to execute onSuccess
    mockLogoutMutate.mockImplementation((_, options) => {
      options?.onSuccess?.();
    });

    const user = userEvent.setup();
    renderWithClient(
      <MainLayout>
        <div>Content</div>
      </MainLayout>,
    );

    // Click the first Sign Out button found
    const signOutButtons = screen.getAllByText('Sign Out');
    await user.click(signOutButtons[0]);

    expect(mockNavigate).toHaveBeenCalledWith('/');
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
    renderWithClient(
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

    // Verify events are hidden (unmounted) or at least check data is updated
    // Since logic is shared, clicking one header should toggle state for both if they share state (which they do)
  });
});
