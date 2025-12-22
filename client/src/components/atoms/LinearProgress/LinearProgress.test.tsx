import { render, screen } from '@/test-utils';
import { describe, it, expect } from 'vitest';
import { LinearProgress } from './LinearProgress';

describe('LinearProgress', () => {
  it('renders correctly', () => {
    render(<LinearProgress />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
});
