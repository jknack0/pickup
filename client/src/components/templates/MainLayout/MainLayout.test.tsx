import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MainLayout } from './MainLayout';

describe('MainLayout', () => {
  it('renders children correctly', () => {
    render(
      <MainLayout>
        <div data-testid="test-child">Child Content</div>
      </MainLayout>,
    );
    expect(screen.getByTestId('test-child')).toBeInTheDocument();
  });

  it('renders the header title', () => {
    render(
      <MainLayout>
        <div>Content</div>
      </MainLayout>,
    );
    expect(screen.getByText('Pickup')).toBeInTheDocument();
  });

  it('renders sidebar items', () => {
    render(
      <MainLayout>
        <div>Content</div>
      </MainLayout>,
    );
    expect(screen.getByText('Inbox')).toBeInTheDocument();
  });
});
