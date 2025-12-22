import { render, screen } from '@/test-utils';
import { describe, it, expect } from 'vitest';
import { NoSsr } from './NoSsr';

describe('NoSsr', () => {
  it('renders correctly', () => {
    render(<NoSsr>Content</NoSsr>);
    expect(screen.getByText('Content')).toBeInTheDocument();
  });
});
