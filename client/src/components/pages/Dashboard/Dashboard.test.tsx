import { render, screen, fireEvent } from '@/test-utils';
import Dashboard from './Dashboard';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as eventHooks from '@/hooks/useEvents';
import { useUser } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

// Mock dependencies
vi.mock('@/hooks/useEvents');
vi.mock('@/hooks/useAuth');
vi.mock('@/components/molecules/EventCard/EventCard', () => ({
  default: ({ event }: { event: { title: string } }) => (
    <div data-testid="event-card">{event.title}</div>
  ),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

describe('Dashboard', () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useNavigate as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockNavigate);
    (useUser as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      data: { user: { firstName: 'Test', lastName: 'User' } },
    });
  });

  it('renders loading state', () => {
    (eventHooks.useMyEvents as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    });

    render(<Dashboard />);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('renders error state', () => {
    (eventHooks.useMyEvents as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('Failed to load'),
    });

    render(<Dashboard />);

    expect(screen.getByText('Failed to load events')).toBeInTheDocument();
  });

  it('renders empty state', () => {
    (eventHooks.useMyEvents as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    });

    render(<Dashboard />);

    // Check for the actual empty state text in the component
    expect(screen.getByText('No events yet')).toBeInTheDocument();
  });

  it('renders events', () => {
    const mockEvents = [
      { _id: '1', title: 'Volleyball 1', status: 'ACTIVE' },
      { _id: '2', title: 'Volleyball 2', status: 'ACTIVE' },
    ];
    (eventHooks.useMyEvents as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      data: mockEvents,
      isLoading: false,
      error: null,
    });

    render(<Dashboard />);

    expect(screen.getAllByTestId('event-card')).toHaveLength(2);
    expect(screen.getByText('Volleyball 1')).toBeInTheDocument();
  });

  it('navigates to create event', () => {
    (eventHooks.useMyEvents as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    });

    render(<Dashboard />);

    // There are multiple "Create Event" buttons, click the first one
    const createButtons = screen.getAllByText('Create Event');
    fireEvent.click(createButtons[0]);
    expect(mockNavigate).toHaveBeenCalledWith('/events/new');
  });
});
