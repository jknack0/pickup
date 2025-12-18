import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ConfirmationDialog from './ConfirmationDialog';

describe('ConfirmationDialog', () => {
  const defaultProps = {
    open: true,
    title: 'Confirm Action',
    content: 'Are you sure you want to proceed?',
    onConfirm: vi.fn(),
    onCancel: vi.fn(),
  };

  it('renders correctly when open', () => {
    render(<ConfirmationDialog {...defaultProps} />);
    expect(screen.getByText('Confirm Action')).toBeInTheDocument();
    expect(screen.getByText('Are you sure you want to proceed?')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(<ConfirmationDialog {...defaultProps} open={false} />);
    expect(screen.queryByText('Confirm Action')).not.toBeInTheDocument();
  });

  it('calls onConfirm when confirm button is clicked', () => {
    render(<ConfirmationDialog {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: 'Confirm' }));
    expect(defaultProps.onConfirm).toHaveBeenCalledTimes(1);
  });

  it('calls onCancel when cancel button is clicked', () => {
    render(<ConfirmationDialog {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(defaultProps.onCancel).toHaveBeenCalledTimes(1);
  });

  it('displays loading state correctly', () => {
    render(<ConfirmationDialog {...defaultProps} isLoading={true} />);
    const confirmBtn = screen.getByRole('button', { name: 'Confirm' });
    const cancelBtn = screen.getByRole('button', { name: 'Cancel' });

    expect(confirmBtn).toBeDisabled();
    expect(cancelBtn).toBeDisabled();
    // Check for CircularProgress (it usually renders as an svg or has a specific role/class, but simplistic check is content)
    // MUI CircularProgress behaves a bit specifically, but since we modify startIcon, we can check if the button contains the spinner logic or just check disabled state.
  });

  it('customizes button text and color', () => {
    render(
      <ConfirmationDialog
        {...defaultProps}
        confirmText="Delete"
        cancelText="Back"
        confirmColor="error"
      />,
    );
    const confirmBtn = screen.getByRole('button', { name: 'Delete' });
    expect(confirmBtn).toBeInTheDocument();
    expect(confirmBtn).toHaveClass('MuiButton-containedError'); // Implementation detail of MUI
    expect(screen.getByRole('button', { name: 'Back' })).toBeInTheDocument();
  });
});
