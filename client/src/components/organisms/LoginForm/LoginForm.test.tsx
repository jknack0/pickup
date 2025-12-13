import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LoginForm } from './LoginForm';

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

const renderWithClient = (ui: React.ReactNode) => {
  const testClient = createTestQueryClient();
  return render(<QueryClientProvider client={testClient}>{ui}</QueryClientProvider>);
};

describe('LoginForm', () => {
  it('renders title and subtitle', () => {
    renderWithClient(<LoginForm />);

    expect(screen.getByRole('heading', { name: /log in/i })).toBeInTheDocument();
    expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
  });

  it('renders login button', () => {
    renderWithClient(<LoginForm />);

    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
  });

  it('renders input fields', () => {
    renderWithClient(<LoginForm />);

    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });
});
