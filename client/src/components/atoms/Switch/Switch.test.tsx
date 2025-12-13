import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Switch } from './Switch';

describe('Switch', () => {
  it('renders correctly', () => {
    render(<Switch data-testid="switch" />);
    expect(screen.getByTestId('switch')).toBeInTheDocument();
  });
});
