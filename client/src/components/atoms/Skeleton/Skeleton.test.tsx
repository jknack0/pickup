import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Skeleton } from './Skeleton';

describe('Skeleton', () => {
  it('renders correctly', () => {
    // Skeleton often has no text, checking for class or just that it doesn't crash
    const { container } = render(<Skeleton width={100} height={40} />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
