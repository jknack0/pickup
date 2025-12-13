import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ListItemText } from './ListItemText';

describe('ListItemText', () => {
  it('renders correctly', () => {
    render(<ListItemText primary="Primary Text" />);
    expect(screen.getByText('Primary Text')).toBeInTheDocument();
  });
});
