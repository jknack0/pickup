import { render } from '@testing-library/react';
import { describe, it } from 'vitest';
import CreateEvent from './CreateEvent';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SnackbarProvider } from 'notistack';

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

describe('CreateEvent Page', () => {
  it('renders without crashing', () => {
    const client = createTestQueryClient();
    render(
      <QueryClientProvider client={client}>
        <SnackbarProvider>
          <MemoryRouter>
            <CreateEvent />
          </MemoryRouter>
        </SnackbarProvider>
      </QueryClientProvider>,
    );
  });
});
