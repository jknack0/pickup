import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Container } from './Container';

describe('Container', () => {
  it('renders correctly', () => {
    render(<Container>Container Content</Container>);
    expect(screen.getByText('Container Content')).toBeInTheDocument();
  });
});
