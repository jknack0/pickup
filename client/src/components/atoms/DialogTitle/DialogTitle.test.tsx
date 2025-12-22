import { render, screen } from '@/test-utils';
import { describe, it, expect } from 'vitest';
import { DialogTitle } from './DialogTitle';

describe('DialogTitle', () => {
  it('renders correctly', () => {
    render(<DialogTitle>Title</DialogTitle>);
    expect(screen.getByText('Title')).toBeInTheDocument();
  });
});
