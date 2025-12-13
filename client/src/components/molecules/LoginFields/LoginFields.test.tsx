import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { LoginFields } from './LoginFields';

describe('LoginFields', () => {
  it('renders email and password fields', () => {
    render(<LoginFields />);

    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it('fields are required', () => {
    render(<LoginFields />);

    expect(screen.getByLabelText(/email address/i)).toBeRequired();
    expect(screen.getByLabelText(/password/i)).toBeRequired();
  });
});
