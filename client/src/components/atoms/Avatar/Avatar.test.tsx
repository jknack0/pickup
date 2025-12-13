import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Avatar } from './Avatar';

describe('Avatar', () => {
  it('renders correctly', () => {
    render(<Avatar>A</Avatar>);
    expect(screen.getByText('A')).toBeInTheDocument();
  });
});
