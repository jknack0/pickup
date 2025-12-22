import { render, screen, fireEvent } from '@/test-utils';
import JoinEventButton from './JoinEventButton';
import { describe, it, expect, vi } from 'vitest';
import type { IEvent } from '@pickup/shared';
import { EventType, EventFormat, EventStatus } from '@pickup/shared';

// Mocks
vi.mock('@hooks/useAuth', () => ({
  useUser: () => ({ data: { user: { _id: '123' } }, isLoading: false }),
}));
vi.mock('@hooks/useEvents', () => ({
  useJoinEvent: () => ({ mutate: vi.fn() }),
}));
vi.mock('@/hooks/usePayment', () => ({
  useCreateCheckout: () => ({ mutateAsync: vi.fn() }),
}));

const mockEvent: IEvent = {
  _id: '1',
  title: 'Test Event',
  date: new Date(),
  location: 'Test Location',
  description: 'Test Description',
  organizer: 'org1',
  attendees: [],
  type: EventType.VOLLEYBALL,
  format: EventFormat.OPEN_GYM,
  status: EventStatus.ACTIVE,
  isPaid: false,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('JoinEventButton', () => {
  it('opens dialog with position options on click', async () => {
    render(<JoinEventButton event={mockEvent} />);

    const joinButton = screen.getByRole('button', { name: /Join Event/i });
    expect(joinButton).toBeInTheDocument();

    fireEvent.click(joinButton);

    expect(screen.getByText(/Select Positions/i)).toBeInTheDocument();
    expect(screen.getByText(/1. Setter/i)).toBeInTheDocument();
    expect(screen.getByText(/2. Outside/i)).toBeInTheDocument();
  });
});
