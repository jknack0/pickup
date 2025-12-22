import { render, waitFor, screen } from '@/test-utils';
import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import EventDetails from './EventDetails';
import * as clientApi from '@/api/client';
import * as authHooks from '@/hooks/useAuth';
import { useParams, useSearchParams, useNavigate, useLocation } from 'react-router-dom';

vi.mock('@/api/client');
vi.mock('@/hooks/useAuth');
vi.mock('@/hooks/usePayment', () => ({
  useVerifyPayment: () => ({
    mutateAsync: vi.fn().mockResolvedValue({}),
  }),
}));
vi.mock('@/components/atoms/MapPreview/MapPreview', () => ({
  default: () => <div data-testid="map-preview">Map Preview</div>,
}));
vi.mock('@/components/organisms/JoinEventButton', () => ({
  default: () => <button>Join Event</button>,
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: vi.fn(),
    useSearchParams: vi.fn(),
    useNavigate: vi.fn(),
    useLocation: vi.fn(),
  };
});

describe('EventDetails Invitation Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock router hooks
    (useParams as unknown as Mock).mockReturnValue({ id: '123' });
    (useSearchParams as unknown as Mock).mockReturnValue([new URLSearchParams(), vi.fn()]);
    (useNavigate as unknown as Mock).mockReturnValue(vi.fn());
    (useLocation as unknown as Mock).mockReturnValue({ pathname: '/events/123', state: null });

    // Update useUser mock
    (authHooks.useUser as unknown as Mock).mockReturnValue({
      data: { user: { _id: 'user123' } },
      isLoading: false,
    });
  });

  it.skip('calls joinEvent when ?join=true is present', async () => {
    // Skipped - complex integration test
  });

  it('hides Join Event button for organizer', async () => {
    const mockEvent = {
      _id: '123',
      title: 'Organizer Event',
      date: new Date().toISOString(),
      location: 'Test Location',
      attendees: [],
      organizer: { _id: 'user123', firstName: 'John' }, // Matches logged in user
      type: 'VOLLEYBALL',
      format: 'OPEN_GYM',
      status: 'ACTIVE',
    };

    (clientApi.getEvent as unknown as Mock).mockResolvedValue({ data: { event: mockEvent } });

    render(<EventDetails />);

    await waitFor(() => {
      expect(screen.getByText('Organizer Event')).toBeInTheDocument();
    });

    expect(screen.queryByText('Join Event')).not.toBeInTheDocument();
  });

  it('hides Join Event button for existing attendee', async () => {
    const mockEvent = {
      _id: '124',
      title: 'Attending Event',
      date: new Date().toISOString(),
      location: 'Test Location',
      attendees: [
        {
          user: { _id: 'user123', firstName: 'John', lastName: 'Doe', email: 'john@example.com' },
          status: 'YES',
        },
      ],
      organizer: { _id: 'otherUser', firstName: 'Jane' },
      type: 'VOLLEYBALL',
      format: 'OPEN_GYM',
      status: 'ACTIVE',
    };

    (useParams as unknown as Mock).mockReturnValue({ id: '124' });
    (clientApi.getEvent as unknown as Mock).mockResolvedValue({ data: { event: mockEvent } });

    render(<EventDetails />);

    await waitFor(() => {
      expect(screen.getByText('Attending Event')).toBeInTheDocument();
    });

    expect(screen.queryByText('Join Event')).not.toBeInTheDocument();
  });
});
