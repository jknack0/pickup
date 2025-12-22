import { render } from '@/test-utils';
import { describe, it, vi } from 'vitest';
import CreateEvent from './CreateEvent';

// Mock API
vi.mock('@/api/client');

// Mock react-router-dom hooks
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

// Mock LocationAutocomplete
vi.mock('@/components/atoms/LocationAutocomplete/LocationAutocomplete', () => ({
  default: () => <input aria-label="Location" />,
}));

describe('CreateEvent Page', () => {
  it('renders without crashing', () => {
    render(<CreateEvent />);
  });
});
