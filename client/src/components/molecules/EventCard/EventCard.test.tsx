import { render, screen, fireEvent } from '@testing-library/react';
import EventCard from './EventCard';
import { describe, it, expect, vi } from 'vitest';
import type { IEvent } from '@pickup/shared';
import { MemoryRouter } from 'react-router';

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

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('EventCard', () => {
  it('renders event details', () => {
    render(
      <MemoryRouter>
        <EventCard event={mockEvent} />
      </MemoryRouter>,
    );
    expect(screen.getByText('Test Event')).toBeInTheDocument();
    expect(screen.getByText('Test Location')).toBeInTheDocument();
  });

  it('navigates to details on click', () => {
    render(
      <MemoryRouter>
        <EventCard event={mockEvent} />
      </MemoryRouter>,
    );
    fireEvent.click(screen.getByText('View Details'));
    expect(mockNavigate).toHaveBeenCalledWith('/events/123');
  });

  it('renders map preview when coordinates are present', () => {
    const eventWithCoords = {
      ...mockEvent,
      coordinates: { lat: 10, lng: 20 },
    };
    render(
      <MemoryRouter>
        <EventCard event={eventWithCoords} />
      </MemoryRouter>,
    );
    expect(screen.getByTestId('map-preview')).toBeInTheDocument();
  });
});
