import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { PaginationItem } from './PaginationItem';

describe('PaginationItem', () => {
  it('renders correctly', () => {
    render(<PaginationItem page={1} />);
    expect(screen.getByText('1')).toBeInTheDocument();
  });
});
