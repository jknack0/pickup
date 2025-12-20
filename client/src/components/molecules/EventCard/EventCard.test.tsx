import { render, screen, fireEvent } from '@testing-library/react';
import EventCard from './EventCard';
import { describe, it, expect, vi } from 'vitest';
import type { IEvent } from '@pickup/shared';
import { MemoryRouter } from 'react-router-dom';

const mockEvent: IEvent = {
  _id: '123',
  title: 'Test Event',
  date: new Date('2025-01-01').toISOString(),
  location: 'Test Location',
  optimizer: 'user1',
  attendees: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
} as unknown as IEvent;

const mockNavigate = vi.fn();

// Mock MapPreview
vi.mock('@/components/atoms/MapPreview/MapPreview', () => ({
  default: () => <div data-testid="map-preview">Map Preview</div>,
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock useAuth
vi.mock('@/hooks/useAuth', () => ({
  useUser: () => ({
    data: {
      user: {
        _id: 'user1',
        firstName: 'Test',
        lastName: 'User',
      },
    },
    isLoading: false,
  }),
}));

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

describe('EventCard', () => {
  it('renders event details', () => {
    const client = createTestQueryClient();
    render(
      <QueryClientProvider client={client}>
        <MemoryRouter>
          <EventCard event={mockEvent} />
        </MemoryRouter>
      </QueryClientProvider>,
    );
    expect(screen.getByText('Test Event')).toBeInTheDocument();
    expect(screen.getByText('Test Location')).toBeInTheDocument();
  });

  it('navigates to details on click', () => {
    const client = createTestQueryClient();
    render(
      <QueryClientProvider client={client}>
        <MemoryRouter>
          <EventCard event={mockEvent} />
        </MemoryRouter>
      </QueryClientProvider>,
    );
    fireEvent.click(screen.getByText('View Details'));
    expect(mockNavigate).toHaveBeenCalledWith('/events/123');
  });

  it('renders map preview when coordinates are present', () => {
    const client = createTestQueryClient();
    const eventWithCoords = {
      ...mockEvent,
      coordinates: { lat: 10, lng: 20 },
    };
    render(
      <QueryClientProvider client={client}>
        <MemoryRouter>
          <EventCard event={eventWithCoords} />
        </MemoryRouter>
      </QueryClientProvider>,
    );
    expect(screen.getByTestId('map-preview')).toBeInTheDocument();
  });
});
