import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { InputLabel } from './InputLabel';
import { FormControl } from '../FormControl';

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
