import { render, screen } from '@/test-utils';
import { describe, it, expect } from 'vitest';
import { Snackbar } from './Snackbar';

describe('Snackbar', () => {
  it('renders correctly', () => {
    render(<Snackbar open={true} message="Notification" />);
    expect(screen.getByText('Notification')).toBeInTheDocument();
  });
});
