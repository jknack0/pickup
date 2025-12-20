import { render, screen } from '@testing-library/react';
import JoinEventButton from './JoinEventButton';
import { describe, it, expect, vi } from 'vitest';
import type { IEvent } from '@pickup/shared';
import { EventType, EventFormat, EventStatus } from '@pickup/shared';
import { BrowserRouter } from 'react-router-dom';

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
vi.mock('notistack', () => ({
  useSnackbar: () => ({ enqueueSnackbar: vi.fn() }),
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
    render(
      <BrowserRouter>
        <JoinEventButton event={mockEvent} />
      </BrowserRouter>,
    );

    const joinButton = screen.getByRole('button', { name: /Join Event/i });
    expect(joinButton).toBeInTheDocument();

    const { fireEvent } = await import('@testing-library/react');
    fireEvent.click(joinButton);

    expect(screen.getByText(/Select Positions/i)).toBeInTheDocument();
    expect(screen.getByText(/1. Setter/i)).toBeInTheDocument();
    expect(screen.getByText(/2. Outside/i)).toBeInTheDocument();
  });
});
