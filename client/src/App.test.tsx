import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from './App';

// Mock Google Maps API Provider to avoid API key issues in tests
vi.mock('@vis.gl/react-google-maps', () => ({
  APIProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('App', () => {
  it('renders without crashing', async () => {
    render(<App />);
    // The app renders with RouterProvider which shows the landing page
    expect(await screen.findByText(/Organize Pickup Games/i)).toBeInTheDocument();
  });
});
