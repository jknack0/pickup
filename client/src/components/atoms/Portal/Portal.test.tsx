import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Portal } from './Portal';

describe('Portal', () => {
  it('renders correctly', () => {
    render(
      <Portal>
        <div>Content</div>
      </Portal>,
    );
    expect(screen.getByText('Content')).toBeInTheDocument();
  });
});
