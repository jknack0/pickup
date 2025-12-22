import { render, screen } from '@/test-utils';
import { describe, it, expect } from 'vitest';
import { TableContainer } from './TableContainer';

describe('TableContainer', () => {
  it('renders correctly', () => {
    render(<TableContainer data-testid="table-container" />);
    expect(screen.getByTestId('table-container')).toBeInTheDocument();
  });
});
