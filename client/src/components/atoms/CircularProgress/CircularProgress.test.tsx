import { render, screen } from '@/test-utils';
import { describe, it, expect } from 'vitest';
import { CircularProgress } from './CircularProgress';

describe('CircularProgress', () => {
  it('renders correctly', () => {
    render(<CircularProgress />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
});
