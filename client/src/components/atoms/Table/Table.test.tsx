import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Table } from './Table';

describe('Table', () => {
  it('renders correctly', () => {
    render(<Table data-testid="table" />);
    expect(screen.getByTestId('table')).toBeInTheDocument();
  });
});
