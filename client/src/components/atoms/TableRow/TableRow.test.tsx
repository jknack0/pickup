import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TableRow } from './TableRow';
import { Table } from '../Table';
import { TableBody } from '../TableBody';

describe('TableRow', () => {
  it('renders correctly', () => {
    render(
      <Table>
        <TableBody>
          <TableRow data-testid="row" />
        </TableBody>
      </Table>,
    );
    expect(screen.getByTestId('row')).toBeInTheDocument();
  });
});
