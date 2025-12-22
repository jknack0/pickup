import { render, screen } from '@/test-utils';
import { describe, it, expect } from 'vitest';
import { Chip } from './Chip';

describe('Chip', () => {
  it('renders correctly', () => {
    render(<Chip label="Test Chip" />);
    expect(screen.getByText('Test Chip')).toBeInTheDocument();
  });
});
