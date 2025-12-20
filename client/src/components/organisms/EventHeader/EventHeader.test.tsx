import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import EventHeader from './EventHeader';
import { EventStatus, EventType, EventFormat, type IEvent } from '@pickup/shared';

describe('EventHeader', () => {
  const mockEvent: IEvent = {
    _id: '1',
    title: 'Volleyball Match',
    type: EventType.VOLLEYBALL,
    format: EventFormat.OPEN_GYM,
    status: EventStatus.ACTIVE,
    date: new Date().toISOString(),
    location: 'Gym',
    coordinates: { lat: 37.7749, lng: -122.4194 },
    organizer: 'org1',
    attendees: [],
    description: 'Fun game',

    isPaid: false,
    price: 0,
    currency: 'usd',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const defaultProps = {
    event: mockEvent,
    isOrganizer: false,
    isAttending: false,
    onJoinClick: vi.fn(),
    onShareClick: vi.fn(),
    onCancelEventClick: vi.fn(),
  };

  it('renders event title and chips', () => {
    render(<EventHeader {...defaultProps} />);
    expect(screen.getByText('Volleyball Match')).toBeInTheDocument();
    expect(screen.getByText('VOLLEYBALL')).toBeInTheDocument();
    expect(screen.getByText('OPEN GYM')).toBeInTheDocument();
  });

  it('renders Join button when not attending and not organizer', () => {
    render(<EventHeader {...defaultProps} />);
    const joinBtn = screen.getByText('Join Event');
    expect(joinBtn).toBeInTheDocument();
    fireEvent.click(joinBtn);
    expect(defaultProps.onJoinClick).toHaveBeenCalled();
  });

  it('does not render Join button if attending', () => {
    render(<EventHeader {...defaultProps} isAttending={true} />);
    expect(screen.queryByText('Join Event')).not.toBeInTheDocument();
  });

  it('does not render Join button if organizer', () => {
    render(<EventHeader {...defaultProps} isOrganizer={true} />);
    expect(screen.queryByText('Join Event')).not.toBeInTheDocument();
  });

  it('renders organizer menu if organizer', () => {
    render(<EventHeader {...defaultProps} isOrganizer={true} />);
    const menuBtn = screen.getByTestId('MoreVertIcon').closest('button');
    expect(menuBtn).toBeInTheDocument();
    if (menuBtn) fireEvent.click(menuBtn);

    expect(screen.getByText('Share Event')).toBeInTheDocument();
    expect(screen.getByText('Cancel Event')).toBeInTheDocument();
  });

  it('calls onCancelEventClick when cancel is clicked from menu', () => {
    render(<EventHeader {...defaultProps} isOrganizer={true} />);
    const menuBtn = screen.getByTestId('MoreVertIcon').closest('button');
    if (menuBtn) fireEvent.click(menuBtn);

    const cancelBtn = screen.getByText('Cancel Event');
    fireEvent.click(cancelBtn);
    expect(defaultProps.onCancelEventClick).toHaveBeenCalled();
  });
});
