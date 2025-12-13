import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Slider } from './Slider';

describe('Slider', () => {
  it('renders correctly', () => {
    render(<Slider data-testid="slider" />);
    expect(screen.getByTestId('slider')).toBeInTheDocument();
  });
});
