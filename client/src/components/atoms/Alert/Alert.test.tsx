import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Alert } from './Alert';

describe('Alert', () => {
  it('renders correctly', () => {
    render(<Alert severity="success">Success Alert</Alert>);
    expect(screen.getByText('Success Alert')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });
});
