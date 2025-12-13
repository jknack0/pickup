import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Signup } from './Signup';
import { BrowserRouter } from 'react-router-dom';

describe('Signup Page', () => {
  it('renders the signup form', () => {
    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>,
    );
    expect(screen.getByRole('heading', { name: /sign up/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
  });
});
