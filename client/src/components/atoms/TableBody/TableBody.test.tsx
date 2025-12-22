import { render, screen } from '@/test-utils';
import { describe, it, expect } from 'vitest';
import { TableBody } from './TableBody';
import { Table } from '@atoms/Table';

describe('TableBody', () => {
  it('renders correctly', () => {
    render(
      <Table>
        <TableBody data-testid="tbody" />
      </Table>,
    );
    expect(screen.getByTestId('tbody')).toBeInTheDocument();
  });
});
