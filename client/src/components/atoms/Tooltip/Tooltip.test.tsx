import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { Tooltip } from './Tooltip';

describe('Tooltip', () => {
  it('renders correctly', async () => {
    render(
      <Tooltip title="Tooltip Text">
        <button>Hover me</button>
      </Tooltip>,
    );
    const button = screen.getByText('Hover me');
    await userEvent.hover(button);
    await waitFor(() => {
      expect(screen.getByRole('tooltip', { name: 'Tooltip Text' })).toBeInTheDocument();
    });
  });
});
