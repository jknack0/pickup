import { render } from '@/test-utils';
import { describe, it, vi } from 'vitest';
import { HomeLayout } from './HomeLayout';
import { useLogout, useUser } from '@hooks/useAuth';

// Mock auth hooks
vi.mock('@hooks/useAuth');

describe('HomeLayout', () => {
  it('renders without crashing', () => {
    (useUser as unknown as ReturnType<typeof vi.fn>).mockReturnValue({ data: null });
    (useLogout as unknown as ReturnType<typeof vi.fn>).mockReturnValue({ mutate: vi.fn() });

    render(
      <HomeLayout>
        <div>Child</div>
      </HomeLayout>,
    );
  });
});
