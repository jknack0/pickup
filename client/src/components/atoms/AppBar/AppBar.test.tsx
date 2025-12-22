import { render, screen } from '@/test-utils';
import { describe, it, expect } from 'vitest';
import { AppBar } from './AppBar';

describe('AppBar', () => {
  it('renders correctly', () => {
    render(<AppBar position="static">Content</AppBar>);
    expect(screen.getByText('Content')).toBeInTheDocument();
  });
});
