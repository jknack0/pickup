import { render, screen } from '@/test-utils';
import { describe, it, expect } from 'vitest';
import { Fade } from './Fade';

describe('Fade', () => {
  it('renders correctly', () => {
    render(
      <Fade in={true}>
        <div>Content</div>
      </Fade>,
    );
    expect(screen.getByText('Content')).toBeInTheDocument();
  });
});
