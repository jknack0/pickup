import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Autocomplete } from './Autocomplete';
import { TextField } from '../TextField';

describe('Autocomplete', () => {
  it('renders correctly', () => {
    render(
      <Autocomplete
        options={['Option 1', 'Option 2']}
        renderInput={(params) => <TextField {...params} label="Test" />}
      />,
    );
    expect(screen.getByLabelText('Test')).toBeInTheDocument();
  });
});
