import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Popper } from './Popper';

describe('Popper', () => {
  it('renders correctly', () => {
    // Popper needs anchorEl
    const anchorEl = document.createElement('div');
    render(
      <Popper open={true} anchorEl={anchorEl}>
        Content
      </Popper>,
    );
    expect(screen.getByText('Content')).toBeInTheDocument();
  });
});
