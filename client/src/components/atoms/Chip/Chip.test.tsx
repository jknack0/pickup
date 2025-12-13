import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Chip } from './Chip';

describe('Chip', () => {
  it('renders correctly', () => {
    render(<Chip label="Test Chip" />);
    expect(screen.getByText('Test Chip')).toBeInTheDocument();
  });
});
