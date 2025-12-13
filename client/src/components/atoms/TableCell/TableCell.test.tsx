import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TableCell } from './TableCell';
import { Table } from '../Table';
import { TableBody } from '../TableBody';
import { TableRow } from '../TableRow';

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
