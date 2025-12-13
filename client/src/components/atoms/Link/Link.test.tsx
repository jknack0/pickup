import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Link } from './Link';

describe('Link', () => {
  it('renders correctly', () => {
    render(<Link href="#">Link Text</Link>);
    expect(screen.getByRole('link', { name: 'Link Text' })).toBeInTheDocument();
  });
});
