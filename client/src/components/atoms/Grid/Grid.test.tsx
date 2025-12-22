import { render, screen } from '@/test-utils';
import { describe, it, expect } from 'vitest';
import { Grid } from './Grid';

describe('Grid', () => {
  it('renders correctly', () => {
    render(<Grid data-testid="grid">Grid Content</Grid>);
    expect(screen.getByTestId('grid')).toBeInTheDocument();
    expect(screen.getByText('Grid Content')).toBeInTheDocument();
  });
});
