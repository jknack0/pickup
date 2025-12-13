import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Typography } from './Typography';

describe('Typography', () => {
  it('renders correctly', () => {
    render(<Typography>Test Text</Typography>);
    expect(screen.getByText('Test Text')).toBeInTheDocument();
  });
});
