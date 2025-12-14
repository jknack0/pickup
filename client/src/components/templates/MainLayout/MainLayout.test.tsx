import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MainLayout } from './MainLayout';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

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

describe('MainLayout', () => {
  it('renders children correctly', () => {
    renderWithClient(
      <MainLayout>
        <div data-testid="test-child">Child Content</div>
      </MainLayout>,
    );
    expect(screen.getByTestId('test-child')).toBeInTheDocument();
  });

  it('renders the header title', () => {
    renderWithClient(
      <MainLayout>
        <div>Content</div>
      </MainLayout>,
    );
    expect(screen.getByText('Pickup')).toBeInTheDocument();
  });

  it('renders sidebar items', () => {
    renderWithClient(
      <MainLayout>
        <div>Content</div>
      </MainLayout>,
    );
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('My Games')).toBeInTheDocument();
    expect(screen.getByText('Sign Out')).toBeInTheDocument();
  });
});
