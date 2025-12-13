import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { RadioGroup } from './RadioGroup';
import { FormControl } from '../FormControl';

describe('RadioGroup', () => {
  it('renders correctly', () => {
    render(
      <FormControl>
        <RadioGroup data-testid="radio-group" />
      </FormControl>,
    );
    expect(screen.getByTestId('radio-group')).toBeInTheDocument();
  });
});
