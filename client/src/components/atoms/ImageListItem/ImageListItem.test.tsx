import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ImageListItem } from './ImageListItem';
import { ImageList } from '@atoms/ImageList';

describe('ImageListItem', () => {
  it('renders correctly', () => {
    // ImageListItem usually needs to be in ImageList context
    render(
      <ImageList>
        <ImageListItem>
          <img src="test.jpg" alt="test" />
        </ImageListItem>
      </ImageList>,
    );
    expect(screen.getByRole('img')).toBeInTheDocument();
  });
});
