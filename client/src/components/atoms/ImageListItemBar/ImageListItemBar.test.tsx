import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ImageListItemBar } from './ImageListItemBar';

describe('ImageListItemBar', () => {
  it('renders correctly', () => {
    render(<ImageListItemBar title="Title" subtitle="Subtitle" />);
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Subtitle')).toBeInTheDocument();
  });
});
