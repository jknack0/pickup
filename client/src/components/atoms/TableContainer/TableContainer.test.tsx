import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TableContainer } from './TableContainer';

describe('TableContainer', () => {
  it('renders correctly', () => {
    render(<TableContainer data-testid="table-container" />);
    expect(screen.getByTestId('table-container')).toBeInTheDocument();
  });
});
