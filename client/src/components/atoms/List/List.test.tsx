import { render, screen } from '@/test-utils';
import { describe, it, expect } from 'vitest';
import { List } from './List';

describe('List', () => {
  it('renders correctly', () => {
    render(<List data-testid="list">Content</List>);
    expect(screen.getByTestId('list')).toBeInTheDocument();
  });
});
