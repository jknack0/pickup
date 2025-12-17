import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { AuthLayout } from './AuthLayout';

describe('AuthLayout', () => {
  it('renders children correctly', () => {
    render(
      <MemoryRouter>
        <AuthLayout>
          <div>Test Content</div>
        </AuthLayout>
      </MemoryRouter>,
    );
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });
});
