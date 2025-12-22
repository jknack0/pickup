import { render, screen } from '@/test-utils';
import { describe, it, expect } from 'vitest';
import { TextareaAutosize } from './TextareaAutosize';

describe('TextareaAutosize', () => {
  it('renders correctly', () => {
    render(<TextareaAutosize placeholder="Type here" />);
    expect(screen.getByPlaceholderText('Type here')).toBeInTheDocument();
  });
});
