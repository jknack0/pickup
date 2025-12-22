import { render, screen } from '@/test-utils';
import { describe, it, expect } from 'vitest';
import { Stack } from './Stack';

describe('Stack', () => {
  it('renders correctly', () => {
    render(<Stack>Stack Content</Stack>);
    expect(screen.getByText('Stack Content')).toBeInTheDocument();
  });
});
