import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DashboardHome } from './DashboardHome';

describe('DashboardHome', () => {
  it('renders dashboard greeting', () => {
    render(<DashboardHome />);
    expect(screen.getByRole('heading', { name: /dashboard/i })).toBeInTheDocument();
    expect(screen.getByText(/welcome to your dashboard/i)).toBeInTheDocument();
  });
});
