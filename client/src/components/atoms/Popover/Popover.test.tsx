import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Popover } from './Popover';

describe('Popover', () => {
  it('renders correctly', () => {
    render(
      <Popover open={true} anchorReference="anchorPosition" anchorPosition={{ top: 0, left: 0 }}>
        <div>Content</div>
      </Popover>,
    );
    expect(screen.getByText('Content')).toBeInTheDocument();
  });
});
