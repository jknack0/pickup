import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AppBar } from './AppBar';

describe('AppBar', () => {
  it('renders correctly', () => {
    render(<AppBar position="static">Content</AppBar>);
    expect(screen.getByText('Content')).toBeInTheDocument();
  });
});
