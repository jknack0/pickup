import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DialogContentText } from './DialogContentText';

describe('DialogContentText', () => {
  it('renders correctly', () => {
    render(<DialogContentText>Text</DialogContentText>);
    expect(screen.getByText('Text')).toBeInTheDocument();
  });
});
