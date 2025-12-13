import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Badge } from './Badge';

describe('Badge', () => {
  it('renders correctly', () => {
    render(<Badge badgeContent={4}>Content</Badge>);
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });
});
