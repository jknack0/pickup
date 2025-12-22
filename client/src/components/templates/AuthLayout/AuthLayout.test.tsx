import { render, screen } from '@/test-utils';
import { describe, it, expect } from 'vitest';
import { AuthLayout } from './AuthLayout';

describe('AuthLayout', () => {
  it('renders children correctly', () => {
    render(
      <AuthLayout>
        <div>Test Content</div>
      </AuthLayout>,
    );
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });
});
