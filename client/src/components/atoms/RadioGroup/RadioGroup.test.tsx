import { render, screen } from '@/test-utils';
import { describe, it, expect } from 'vitest';
import { RadioGroup } from './RadioGroup';
import { FormControl } from '@atoms/FormControl';

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
