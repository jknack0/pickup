import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MainLayout } from './MainLayout';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import userEvent from '@testing-library/user-event';
import { useNavigate } from 'react-router-dom';
import { useLogout } from '@hooks/useAuth';

// Mock dependencies
vi.mock('react-router-dom');
vi.mock('@hooks/useAuth');

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
  const mockNavigate = vi.fn();
  const mockLogoutMutate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useNavigate as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockNavigate);
    (useLogout as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      mutate: mockLogoutMutate,
    });
  });

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

  it('calls logout and navigates to home on sign out click', async () => {
    // Mock mutate to execute onSuccess
    mockLogoutMutate.mockImplementation((_, options) => {
      options?.onSuccess?.();
    });

    const user = userEvent.setup();
    renderWithClient(
      <MainLayout>
        <div>Content</div>
      </MainLayout>,
    );

    await user.click(screen.getByText('Sign Out'));

    expect(mockLogoutMutate).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});
