import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { theme } from '@/theme';
import Groups from './Groups';

// Mock hooks
vi.mock('@/hooks/useGroups', () => ({
  useMyGroups: vi.fn(() => ({
    data: [],
    isLoading: false,
    error: null,
  })),
  usePublicGroups: vi.fn(() => ({
    data: { groups: [], total: 0 },
    isLoading: false,
    error: null,
  })),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <MemoryRouter>{ui}</MemoryRouter>
      </ThemeProvider>
    </QueryClientProvider>,
  );
};

describe('Groups', () => {
  it('renders page title', () => {
    renderWithProviders(<Groups />);
    expect(screen.getByText('Groups')).toBeInTheDocument();
  });

  it('renders Create Group button', () => {
    renderWithProviders(<Groups />);
    expect(screen.getByText('Create Group')).toBeInTheDocument();
  });

  it('renders My Groups tab', () => {
    renderWithProviders(<Groups />);
    expect(screen.getByText('My Groups')).toBeInTheDocument();
  });

  it('renders Discover tab', () => {
    renderWithProviders(<Groups />);
    expect(screen.getByText('Discover')).toBeInTheDocument();
  });

  it('shows empty state for My Groups', () => {
    renderWithProviders(<Groups />);
    expect(screen.getByText('No groups yet')).toBeInTheDocument();
  });
});
