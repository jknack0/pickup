import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ClickAwayListener } from './ClickAwayListener';

describe('ClickAwayListener', () => {
  it('renders correctly', () => {
    // Needs a child that can accept ref
    render(
      <ClickAwayListener onClickAway={() => {}}>
        <div>Content</div>
      </ClickAwayListener>,
    );
    expect(screen.getByText('Content')).toBeInTheDocument();
  });
});
