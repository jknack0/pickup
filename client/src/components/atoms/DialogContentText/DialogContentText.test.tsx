import { render, screen } from '@/test-utils';
import { describe, it, expect } from 'vitest';
import { DialogContentText } from './DialogContentText';

describe('DialogContentText', () => {
  it('renders correctly', () => {
    render(<DialogContentText>Text</DialogContentText>);
    expect(screen.getByText('Text')).toBeInTheDocument();
  });
});
