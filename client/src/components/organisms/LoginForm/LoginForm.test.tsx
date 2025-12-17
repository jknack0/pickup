import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
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
  return render(
    <QueryClientProvider client={testClient}>
      <MemoryRouter>
        <SnackbarProvider>{ui}</SnackbarProvider>
      </MemoryRouter>
    </QueryClientProvider>,
  );
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

  it('shows validation error on blur', async () => {
    const user = userEvent.setup();
    renderWithClient(<LoginForm />);

    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);

    // Focus and blur email
    await user.click(emailInput);
    await user.click(passwordInput); // Blur email by clicking password

    // Check email error
    expect(await screen.findByText(/invalid email address/i)).toBeInTheDocument();
  });
});
