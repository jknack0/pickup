import { render } from '@testing-library/react';
import { describe, it } from 'vitest';
import { HomeLayout } from './HomeLayout';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

describe('HomeLayout', () => {
  it('renders without crashing', () => {
    const client = createTestQueryClient();
    render(
      <QueryClientProvider client={client}>
        <MemoryRouter>
          <HomeLayout>
            <div>Child</div>
          </HomeLayout>
        </MemoryRouter>
      </QueryClientProvider>,
    );
  });
});
