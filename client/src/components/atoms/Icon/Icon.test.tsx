import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Icon } from './Icon';

describe('Icon', () => {
  it('renders correctly', () => {
    render(<Icon>star</Icon>);
    expect(screen.getByText('star')).toBeInTheDocument();
  });
});
