import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DialogTitle } from './DialogTitle';

describe('DialogTitle', () => {
  it('renders correctly', () => {
    render(<DialogTitle>Title</DialogTitle>);
    expect(screen.getByText('Title')).toBeInTheDocument();
  });
});
