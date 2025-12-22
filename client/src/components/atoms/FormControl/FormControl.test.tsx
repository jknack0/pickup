import { render, screen } from '@/test-utils';
import { describe, it, expect } from 'vitest';
import { FormControl } from './FormControl';

describe('FormControl', () => {
  it('renders correctly', () => {
    render(<FormControl data-testid="form-control" />);
    expect(screen.getByTestId('form-control')).toBeInTheDocument();
  });
});
