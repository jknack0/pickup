import { render, screen } from '@/test-utils';
import { describe, it, expect } from 'vitest';
import { DialogContent } from './DialogContent';

describe('DialogContent', () => {
  it('renders correctly', () => {
    render(<DialogContent>Content</DialogContent>);
    expect(screen.getByText('Content')).toBeInTheDocument();
  });
});
