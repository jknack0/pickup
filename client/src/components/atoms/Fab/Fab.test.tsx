import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Fab } from './Fab';

describe('Fab', () => {
  it('renders correctly', () => {
    render(<Fab>A</Fab>);
    expect(screen.getByRole('button', { name: 'A' })).toBeInTheDocument();
  });
});
