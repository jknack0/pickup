import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { LinearProgress } from './LinearProgress';

describe('LinearProgress', () => {
  it('renders correctly', () => {
    render(<LinearProgress />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
});
