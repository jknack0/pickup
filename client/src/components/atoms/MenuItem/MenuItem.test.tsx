import { render, screen } from '@/test-utils';
import { describe, it, expect } from 'vitest';
import { MenuItem } from './MenuItem';

describe('MenuItem', () => {
  it('renders correctly', () => {
    render(<MenuItem>Item 1</MenuItem>);
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByRole('menuitem')).toBeInTheDocument();
  });
});
