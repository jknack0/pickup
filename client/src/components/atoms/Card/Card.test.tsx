import { render, screen } from '@/test-utils';
import { describe, it, expect } from 'vitest';
import { Card } from './Card';

describe('Card', () => {
  it('renders correctly', () => {
    render(<Card data-testid="card">Card Content</Card>);
    expect(screen.getByTestId('card')).toBeInTheDocument();
    expect(screen.getByText('Card Content')).toBeInTheDocument();
  });
});
