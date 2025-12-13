import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Menu } from './Menu';
import { MenuItem } from '../MenuItem';

describe('Menu', () => {
  it('renders correctly', () => {
    render(
      <Menu open={true} anchorEl={document.body}>
        <MenuItem>Item</MenuItem>
      </Menu>,
    );
    expect(screen.getByText('Item')).toBeInTheDocument();
  });
});
