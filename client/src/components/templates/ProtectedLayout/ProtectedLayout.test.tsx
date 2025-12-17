import { render } from '@testing-library/react';
import { describe, it } from 'vitest';
import { ProtectedLayout } from './ProtectedLayout';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

describe('ProtectedLayout', () => {
  it('renders without crashing', () => {
    const client = createTestQueryClient();
    render(
      <QueryClientProvider client={client}>
        <MemoryRouter>
          <ProtectedLayout>
            <div>Child</div>
          </ProtectedLayout>
        </MemoryRouter>
      </QueryClientProvider>,
    );
  });
});
