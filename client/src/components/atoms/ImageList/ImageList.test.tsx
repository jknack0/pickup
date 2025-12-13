import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ImageList } from './ImageList';

describe('ImageList', () => {
  it('renders correctly', () => {
    render(
      <ImageList data-testid="image-list" cols={3} rowHeight={164}>
        <div />
      </ImageList>,
    );
    expect(screen.getByTestId('image-list')).toBeInTheDocument();
  });
});
