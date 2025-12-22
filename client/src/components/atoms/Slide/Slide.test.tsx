import { render, screen } from '@/test-utils';
import { describe, it, expect } from 'vitest';
import { Slide } from './Slide';

describe('Slide', () => {
  it('renders correctly', () => {
    render(
      <Slide in={true} direction="up">
        <div>Content</div>
      </Slide>,
    );
    expect(screen.getByText('Content')).toBeInTheDocument();
  });
});
