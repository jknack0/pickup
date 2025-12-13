import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Zoom } from './Zoom';

describe('Zoom', () => {
  it('renders correctly', () => {
    render(
      <Zoom in={true}>
        <div>Content</div>
      </Zoom>,
    );
    expect(screen.getByText('Content')).toBeInTheDocument();
  });
});
