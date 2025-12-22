import { render, screen } from '@/test-utils';
import { describe, it, expect } from 'vitest';
import { TableRow } from './TableRow';
import { Table } from '@atoms/Table';
import { TableBody } from '@atoms/TableBody';

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
