import { render, screen } from '@/test-utils';
import { describe, it, expect } from 'vitest';
import { ListItem } from './ListItem';

describe('ListItem', () => {
  it('renders correctly', () => {
    render(<ListItem>Item Content</ListItem>);
    expect(screen.getByText('Item Content')).toBeInTheDocument();
  });
});
