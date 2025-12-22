import { render, screen } from '@/test-utils';
import { describe, it, expect } from 'vitest';
import { Divider } from './Divider';

describe('Divider', () => {
  it('renders correctly', () => {
    render(<Divider data-testid="divider" />);
    expect(screen.getByTestId('divider')).toBeInTheDocument();
  });
});
