import { render, screen } from '@/test-utils';
import { describe, it, expect } from 'vitest';
import { TableCell } from './TableCell';
import { Table } from '@atoms/Table';
import { TableBody } from '@atoms/TableBody';
import { TableRow } from '@atoms/TableRow';

describe('TableCell', () => {
  it('renders correctly', () => {
    render(
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>Cell Content</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );
    expect(screen.getByText('Cell Content')).toBeInTheDocument();
  });
});
