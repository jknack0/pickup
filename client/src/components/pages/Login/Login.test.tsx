import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom'; // Assuming Router is needed if Login page has links
import { Login } from './Login';

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
      <MemoryRouter>{ui}</MemoryRouter>
    </QueryClientProvider>,
  );
};

describe('Login Page', () => {
  it('renders the login form', () => {
    renderWithClient(<Login />);

    expect(screen.getByRole('heading', { name: /log in/i })).toBeInTheDocument();
    // Check for AuthLayout specific elements/styling if needed, but basic smoke test:
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
  });
});
