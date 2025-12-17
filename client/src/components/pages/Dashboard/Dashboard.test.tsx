import { render, screen, fireEvent } from '@testing-library/react';
import Dashboard from './Dashboard';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import * as eventHooks from '@/hooks/useEvents';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock dependencies
vi.mock('@/hooks/useEvents');
vi.mock('@/components/molecules/EventCard/EventCard', () => ({
  default: ({ event }: { event: { title: string } }) => (
    <div data-testid="event-card">{event.title}</div>
  ),
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

describe('Dashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state', () => {
    (eventHooks.useMyEvents as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    });

    render(
      <QueryClientProvider client={createTestQueryClient()}>
        <MemoryRouter>
          <Dashboard />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('renders error state', () => {
    (eventHooks.useMyEvents as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('Failed to load'),
    });

    render(
      <QueryClientProvider client={createTestQueryClient()}>
        <MemoryRouter>
          <Dashboard />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(screen.getByText('Failed to load events')).toBeInTheDocument();
  });

  it('renders empty state', () => {
    (eventHooks.useMyEvents as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    });

    render(
      <QueryClientProvider client={createTestQueryClient()}>
        <MemoryRouter>
          <Dashboard />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(screen.getByText("You haven't created or joined any events yet.")).toBeInTheDocument();
  });

  it('renders events', () => {
    const mockEvents = [
      { _id: '1', title: 'Volleyball 1' },
      { _id: '2', title: 'Volleyball 2' },
    ];
    (eventHooks.useMyEvents as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      data: mockEvents,
      isLoading: false,
      error: null,
    });

    render(
      <QueryClientProvider client={createTestQueryClient()}>
        <MemoryRouter>
          <Dashboard />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(screen.getAllByTestId('event-card')).toHaveLength(2);
    expect(screen.getByText('Volleyball 1')).toBeInTheDocument();
  });

  it('navigates to create event', () => {
    (eventHooks.useMyEvents as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    });

    render(
      <QueryClientProvider client={createTestQueryClient()}>
        <MemoryRouter>
          <Dashboard />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    fireEvent.click(screen.getByText('Create Event'));
    expect(mockNavigate).toHaveBeenCalledWith('/events/new');
  });
});
