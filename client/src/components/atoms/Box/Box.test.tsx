import { render, screen } from '@/test-utils';
import { describe, it, expect } from 'vitest';
import { Box } from './Box';

describe('Box', () => {
  it('renders correctly', () => {
    render(<Box data-testid="box">Content</Box>);
    expect(screen.getByTestId('box')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });
});
