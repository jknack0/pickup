import { render, screen } from '@/test-utils';
import { describe, it, expect } from 'vitest';
import { Backdrop } from './Backdrop';

describe('Backdrop', () => {
  it('renders correctly', () => {
    render(<Backdrop open={true} data-testid="backdrop" />);
    // Backdrop is usually a portal, but standard renders might show it.
    // If hidden, we check if it exists in DOM.
    expect(screen.getByTestId('backdrop')).toBeInTheDocument();
  });
});
