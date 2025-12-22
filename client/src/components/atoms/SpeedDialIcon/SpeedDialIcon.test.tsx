import { render } from '@/test-utils';
import { describe, it, expect } from 'vitest';
import { SpeedDialIcon } from './SpeedDialIcon';

describe('SpeedDialIcon', () => {
  it('renders correctly', () => {
    // Usually rendered inside SpeedDial but can render standalone as a span/icon
    const { container } = render(<SpeedDialIcon />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
