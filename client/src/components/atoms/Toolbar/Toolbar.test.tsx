import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Toolbar } from './Toolbar';

describe('Toolbar', () => {
  it('renders correctly', () => {
    render(<Toolbar>Toolbar Content</Toolbar>);
    expect(screen.getByText('Toolbar Content')).toBeInTheDocument();
  });
});
