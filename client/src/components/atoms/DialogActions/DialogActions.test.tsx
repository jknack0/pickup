import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DialogActions } from './DialogActions';
import { Button } from '@atoms/Button';

describe('DialogActions', () => {
  it('renders correctly', () => {
    render(
      <DialogActions>
        <Button>Action</Button>
      </DialogActions>,
    );
    expect(screen.getByText('Action')).toBeInTheDocument();
  });
});
