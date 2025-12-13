import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ListItemIcon } from './ListItemIcon';

describe('ListItemIcon', () => {
  it('renders correctly', () => {
    render(
      <ListItemIcon>
        <span>Icon</span>
      </ListItemIcon>,
    );
    expect(screen.getByText('Icon')).toBeInTheDocument();
  });
});
