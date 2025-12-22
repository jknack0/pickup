import { render, screen } from '@/test-utils';
import { describe, it, expect } from 'vitest';
import { Avatar } from './Avatar';

describe('Avatar', () => {
  it('renders correctly', () => {
    render(<Avatar>A</Avatar>);
    expect(screen.getByText('A')).toBeInTheDocument();
  });
});
