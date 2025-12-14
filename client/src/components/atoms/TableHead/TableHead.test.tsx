import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TableHead } from './TableHead';
import { Table } from '@atoms/Table';

describe('TableHead', () => {
  it('renders correctly', () => {
    render(
      <Table>
        <TableHead data-testid="thead" />
      </Table>,
    );
    expect(screen.getByTestId('thead')).toBeInTheDocument();
  });
});
