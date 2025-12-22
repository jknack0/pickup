import { render, screen, fireEvent } from '@/test-utils';
import { describe, it, expect, vi } from 'vitest';
import { type IEvent, AttendeeStatus } from '@pickup/shared';
import AttendeeList from './AttendeeList';

describe('AttendeeList', () => {
  const mockAttendees = [
    {
      user: { _id: 'u1', firstName: 'Alice', lastName: 'A', email: 'alice@example.com' },
      status: AttendeeStatus.YES,
      joinedAt: new Date().toISOString(),
    },
    {
      user: { _id: 'u2', firstName: 'Bob', lastName: 'B', email: 'bob@example.com' },
      status: AttendeeStatus.YES,
      joinedAt: new Date().toISOString(),
    },
  ];

  const defaultProps = {
    attendees: mockAttendees as unknown as IEvent['attendees'],
    organizer: { _id: 'org1', firstName: 'Organizer' },
    isOrganizer: false,
    isCanceled: false,
    onAddAttendeeClick: vi.fn(),
    onRemoveAttendee: vi.fn(),
  };

  it('renders attendee count and organizer name', () => {
    render(<AttendeeList {...defaultProps} />);
    expect(screen.getByText('Attendees')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument(); // Chip count
    expect(screen.getByText('Organizer')).toBeInTheDocument();
  });

  it('renders AvatarGroup for non-organizer view', () => {
    render(<AttendeeList {...defaultProps} />);
    // AvatarGroup usually renders avatars. We can check if avatars are present.
    // MUI Avatar uses the name initial if no src.
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('B')).toBeInTheDocument();
  });

  it('renders detailed list with delete buttons for organizer view', () => {
    render(<AttendeeList {...defaultProps} isOrganizer={true} />);
    expect(screen.getByText('Alice A')).toBeInTheDocument();
    expect(screen.getByText('alice@example.com')).toBeInTheDocument();

    // Check for delete icons
    const deleteButtons = screen.getAllByTestId('DeleteIcon');
    expect(deleteButtons).toHaveLength(2);
  });

  it('does not show delete button for organizer (self) in list', () => {
    const attendeesWithOrg = [
      ...mockAttendees,
      {
        user: { _id: 'org1', firstName: 'Organizer', lastName: '', email: 'org@example.com' },
        status: AttendeeStatus.YES,
        joinedAt: new Date(),
      },
    ];

    render(
      <AttendeeList
        {...defaultProps}
        attendees={attendeesWithOrg as unknown as IEvent['attendees']}
        isOrganizer={true}
        organizer={{ _id: 'org1', firstName: 'Organizer' }}
      />,
    );

    // Should have 3 items, but only 2 delete buttons (Alice and Bob)
    const deleteButtons = screen.getAllByTestId('DeleteIcon');
    expect(deleteButtons).toHaveLength(2);
  });

  it('calls onRemoveAttendee when delete is clicked', () => {
    render(<AttendeeList {...defaultProps} isOrganizer={true} />);
    const deleteButtons = screen.getAllByTestId('DeleteIcon');
    fireEvent.click(deleteButtons[0].closest('button')!);
    expect(defaultProps.onRemoveAttendee).toHaveBeenCalledWith('u1');
  });

  it('shows add attendee button for organizer if not canceled', () => {
    render(<AttendeeList {...defaultProps} isOrganizer={true} />);
    expect(screen.getByTestId('PersonAddIcon')).toBeInTheDocument();
  });

  it('hides add attendee button if canceled', () => {
    render(<AttendeeList {...defaultProps} isOrganizer={true} isCanceled={true} />);
    expect(screen.queryByTestId('PersonAddIcon')).not.toBeInTheDocument();
  });
});
