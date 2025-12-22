import { render, screen } from '@/test-utils';
import { describe, it, expect } from 'vitest';
import { Drawer } from './Drawer';

describe('Drawer', () => {
  it('renders correctly', () => {
    render(<Drawer open={true}>Drawer Content</Drawer>);
    expect(screen.getByText('Drawer Content')).toBeInTheDocument();
  });
});
