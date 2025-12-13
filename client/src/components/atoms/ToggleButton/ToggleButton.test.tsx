import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ToggleButton } from './ToggleButton';

describe('ToggleButton', () => {
  it('renders correctly', () => {
    render(<ToggleButton value="check">Check</ToggleButton>);
    expect(screen.getByRole('button', { name: 'Check' })).toBeInTheDocument();
  });
});
