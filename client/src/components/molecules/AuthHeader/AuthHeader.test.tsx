import { render, screen } from '@/test-utils';
import { describe, it, expect } from 'vitest';
import { AuthHeader } from './AuthHeader';

describe('AuthHeader', () => {
  it('renders title correctly', () => {
    render(<AuthHeader title="Test Title" />);
    expect(screen.getByRole('heading', { name: /test title/i })).toBeInTheDocument();
  });

  it('renders default subtitle when none provided', () => {
    render(<AuthHeader title="Test Title" />);
    expect(screen.getByText(/create your account to get started/i)).toBeInTheDocument();
  });

  it('renders custom subtitle when provided', () => {
    render(<AuthHeader title="Test Title" subtitle="Custom Subtitle" />);
    expect(screen.getByText(/custom subtitle/i)).toBeInTheDocument();
  });
});
