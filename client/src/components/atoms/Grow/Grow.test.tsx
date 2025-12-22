import { render, screen } from '@/test-utils';
import { describe, it, expect } from 'vitest';
import { Grow } from './Grow';

describe('Grow', () => {
  it('renders correctly', () => {
    render(
      <Grow in={true}>
        <div>Content</div>
      </Grow>,
    );
    expect(screen.getByText('Content')).toBeInTheDocument();
  });
});
