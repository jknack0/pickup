import { render, screen } from '@/test-utils';
import { describe, it, expect } from 'vitest';
import { Signup } from './Signup';

describe('Signup Page', () => {
  it('renders the signup form', () => {
    render(<Signup />);

    expect(screen.getByText('Create account')).toBeInTheDocument();
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/date of birth/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    // Use getAllByLabelText for password fields due to potential duplicates
    const passwordFields = screen.getAllByLabelText(/password/i);
    expect(passwordFields.length).toBeGreaterThanOrEqual(2); // password + confirm password
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
  });
});
