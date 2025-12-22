import { render, screen } from '@/test-utils';
import { describe, it, expect } from 'vitest';
import { Fab } from './Fab';

describe('Fab', () => {
  it('renders correctly', () => {
    render(<Fab>A</Fab>);
    expect(screen.getByRole('button', { name: 'A' })).toBeInTheDocument();
  });
});
