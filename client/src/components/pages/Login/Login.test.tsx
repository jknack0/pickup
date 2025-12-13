import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Login } from './Login';

// Mock child components to verify composition rather than implementation
vi.mock('../../organisms/LoginForm', () => ({
  LoginForm: () => <div data-testid="login-form">Login Form Content</div>,
}));

describe('Login Page', () => {
  it('renders without crashing', () => {
    render(<Login />);
    expect(screen.getByTestId('login-form')).toBeInTheDocument();
  });
});
