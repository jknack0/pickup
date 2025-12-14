import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SnackbarProvider } from 'notistack';
import { describe, it, expect } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SignupForm } from './SignupForm';

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
      <SnackbarProvider>{ui}</SnackbarProvider>
    </QueryClientProvider>,
  );
};

describe('SignupForm', () => {
  it('renders title and subtitle', () => {
    renderWithClient(<SignupForm />);

    expect(screen.getByRole('heading', { name: /sign up/i })).toBeInTheDocument();
    expect(screen.getByText(/create your account to get started/i)).toBeInTheDocument();
  });

  it('renders sign up button', () => {
    renderWithClient(<SignupForm />);

    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
  });

  it('renders input fields', () => {
    renderWithClient(<SignupForm />);

    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/date of birth/i)).toBeInTheDocument();
  });

  it('shows validation error on blur', async () => {
    const user = userEvent.setup();
    renderWithClient(<SignupForm />);

    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/^password \*/i);

    // Focus and blur email
    await user.click(emailInput);
    await user.click(passwordInput); // Blur email by clicking password

    // Check email error
    expect(await screen.findByText(/invalid email address/i)).toBeInTheDocument();
  });
});
