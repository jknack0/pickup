import { render, screen } from '@/test-utils';
import { describe, it, expect } from 'vitest';
import { TextField } from './TextField';

describe('TextField', () => {
  it('renders correctly', () => {
    render(<TextField label="Test Field" />);
    expect(screen.getByLabelText('Test Field')).toBeInTheDocument();
  });
});
