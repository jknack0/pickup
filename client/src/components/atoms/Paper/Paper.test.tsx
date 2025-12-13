import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Paper } from './Paper';

describe('Paper', () => {
  it('renders correctly', () => {
    render(<Paper data-testid="paper">Paper Content</Paper>);
    expect(screen.getByTestId('paper')).toBeInTheDocument();
    expect(screen.getByText('Paper Content')).toBeInTheDocument();
  });
});
