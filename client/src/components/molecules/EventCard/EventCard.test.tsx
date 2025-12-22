import { render, screen, fireEvent } from '@/test-utils';
import EventCard from './EventCard';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { IEvent } from '@pickup/shared';
import { EventFormat, EventType, EventStatus } from '@pickup/shared';
import { useNavigate } from 'react-router-dom';

const mockEvent: IEvent = {
  _id: '123',
  title: 'Test Event',
  date: new Date('2025-01-01').toISOString(),
  location: 'Test Location',
  organizer: 'user1',
  attendees: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  format: EventFormat.OPEN_GYM,
  type: EventType.VOLLEYBALL,
  status: EventStatus.ACTIVE,
  isPaid: false,
} as IEvent;

// Mock MapPreview
vi.mock('@/components/atoms/MapPreview/MapPreview', () => ({
  default: () => <div data-testid="map-preview">Map Preview</div>,
}));

// Mock JoinEventButton
vi.mock('@/components/organisms/JoinEventButton', () => ({
  default: () => <button>Join Event</button>,
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(),
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

describe('EventCard', () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useNavigate as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockNavigate);
  });

  it('renders event details', () => {
    render(<EventCard event={mockEvent} />);
    expect(screen.getByText('Test Event')).toBeInTheDocument();
    expect(screen.getByText('Test Location')).toBeInTheDocument();
  });

  it('navigates to details on click', () => {
    render(<EventCard event={mockEvent} />);
    // The entire card is clickable
    fireEvent.click(screen.getByText('Test Event'));
    expect(mockNavigate).toHaveBeenCalledWith('/events/123');
  });

  it('renders map preview when coordinates are present', () => {
    const eventWithCoords = {
      ...mockEvent,
      coordinates: { lat: 10, lng: 20 },
    };
    render(<EventCard event={eventWithCoords} />);
    expect(screen.getByTestId('map-preview')).toBeInTheDocument();
  });
});
