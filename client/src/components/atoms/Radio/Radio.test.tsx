import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Radio } from './Radio';

describe('Radio', () => {
  it('renders correctly', () => {
    render(<Radio data-testid="radio" />);
    expect(screen.getByTestId('radio')).toBeInTheDocument();
  });
});
