import { render } from '@/test-utils';
import { describe, it, vi } from 'vitest';
import { ProtectedLayout } from './ProtectedLayout';

// Mock useAuth hook
vi.mock('@/hooks/useAuth', () => ({
  useUser: () => ({
    data: { user: { _id: '123', firstName: 'Test' } },
    isLoading: false,
  }),
}));

describe('ProtectedLayout', () => {
  it('renders without crashing', () => {
    render(
      <ProtectedLayout>
        <div>Child</div>
      </ProtectedLayout>,
    );
  });
});
