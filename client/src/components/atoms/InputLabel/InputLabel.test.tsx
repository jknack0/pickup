import { render, screen } from '@/test-utils';
import { describe, it, expect } from 'vitest';
import { InputLabel } from './InputLabel';
import { FormControl } from '@atoms/FormControl';

describe('InputLabel', () => {
  it('renders correctly', () => {
    render(
      <FormControl>
        <InputLabel>Test Label</InputLabel>
      </FormControl>,
    );
    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });
});
