import { render, screen } from '@/test-utils';
import { describe, it, expect } from 'vitest';
import { Login } from './Login';

describe('Login Page', () => {
  it('renders the login form', () => {
    render(<Login />);

    expect(screen.getByText('Welcome back')).toBeInTheDocument();
    // Check for AuthLayout specific elements/styling if needed, but basic smoke test:
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
  });
});
