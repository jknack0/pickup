import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { IconButton } from './IconButton';

describe('IconButton', () => {
  it('renders correctly', () => {
    render(<IconButton aria-label="test button">X</IconButton>);
    expect(screen.getByRole('button', { name: /test button/i })).toBeInTheDocument();
  });
});
