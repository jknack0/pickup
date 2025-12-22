import { render, screen, fireEvent } from '@/test-utils';
import { describe, it, expect, vi } from 'vitest';
import RSVPControls from './RSVPControls';
import { AttendeeStatus } from '@pickup/shared';

describe('RSVPControls', () => {
  const defaultProps = {
    currentStatus: AttendeeStatus.YES,
    onUpdateStatus: vi.fn(),
    isLoading: false,
  };

  it('renders correctly with current status', () => {
    render(<RSVPControls {...defaultProps} />);
    expect(screen.getByText('Your RSVP')).toBeInTheDocument();

    // Check if buttons exist
    expect(screen.getByText('Going')).toBeInTheDocument();
    expect(screen.getByText('Maybe')).toBeInTheDocument();
    expect(screen.getByText('No')).toBeInTheDocument();
  });

  it('calls onUpdateStatus when a button is clicked', () => {
    render(<RSVPControls {...defaultProps} />);

    // Click Maybe
    fireEvent.click(screen.getByText('Maybe'));
    expect(defaultProps.onUpdateStatus).toHaveBeenCalledWith(AttendeeStatus.MAYBE);
  });

  it('buttons are disabled when isLoading is true', () => {
    render(<RSVPControls {...defaultProps} isLoading={true} />);
    screen.getByRole('group', { name: /rsvp button group/i });
    // ButtonGroup usually disables children via context or cloned props,
    // but in MUI ButtonGroup with 'disabled' prop may pass it down.
    // Let's check individual buttons if possible or just the group attribute if rendered

    // Actually MUI ButtonGroup passes disabled to children.
    // Let's check if the buttons are disabled.
    expect(screen.getByText('Going').closest('button')).toBeDisabled();
    expect(screen.getByText('Maybe').closest('button')).toBeDisabled();
    expect(screen.getByText('No').closest('button')).toBeDisabled();
  });
});
