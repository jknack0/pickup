import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Select } from './Select';
import { MenuItem } from '../MenuItem';
import { FormControl } from '../FormControl';
import { InputLabel } from '../InputLabel';

describe('Select', () => {
  it('renders correctly', () => {
    render(
      <FormControl>
        <InputLabel id="test-select-label">Test Select</InputLabel>
        <Select labelId="test-select-label" value="" label="Test Select">
          <MenuItem value={10}>Ten</MenuItem>
        </Select>
      </FormControl>,
    );
    expect(screen.getAllByRole('combobox')[0]).toBeInTheDocument();
  });
});
