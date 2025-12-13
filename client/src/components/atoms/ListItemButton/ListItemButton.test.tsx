import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ListItemButton } from './ListItemButton';

describe('ListItemButton', () => {
  it('renders correctly', () => {
    render(<ListItemButton>Click me</ListItemButton>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });
});
