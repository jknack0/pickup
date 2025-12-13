import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Pagination } from './Pagination';

describe('Pagination', () => {
  it('renders correctly', () => {
    render(<Pagination count={10} />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });
});
