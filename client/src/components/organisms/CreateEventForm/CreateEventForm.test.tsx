import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CreateEventForm } from './index';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import * as clientApi from '@/api/client';

// Mock API
vi.mock('@/api/client');

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock LocationAutocomplete to avoid complex Google Maps logic
vi.mock('@/components/atoms/LocationAutocomplete/LocationAutocomplete', () => ({
  default: ({
    onPlaceSelect,
  }: {
    onPlaceSelect: (place: {
      name: string;
      formatted_address: string;
      geometry?: { location: { lat: () => number; lng: () => number } };
    }) => void;
  }) => (
    <input
      aria-label="Location"
      onChange={(e) =>
        onPlaceSelect({
          name: e.target.value,
          formatted_address: e.target.value,
        })
      }
    />
  ),
}));

describe('CreateEventForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly', () => {
    render(
      <SnackbarProvider>
        <MemoryRouter>
          <CreateEventForm />
        </MemoryRouter>
      </SnackbarProvider>,
    );

    expect(screen.getByLabelText(/Event Title/i)).toBeInTheDocument();
  });

  it('submits valid form data', async () => {
    (clientApi.createEvent as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: { event: { _id: '123' } },
    });

    render(
      <SnackbarProvider>
        <MemoryRouter>
          <CreateEventForm />
        </MemoryRouter>
      </SnackbarProvider>,
    );

    fireEvent.change(screen.getByLabelText(/Event Title/i), { target: { value: 'My Event' } });
    // Simulate location selection via mocked input
    fireEvent.change(screen.getByLabelText(/Location/i), { target: { value: 'Park' } });
    fireEvent.change(screen.getByLabelText(/Date/i), { target: { value: '2025-01-01T12:00' } });

    fireEvent.click(screen.getByRole('button', { name: /Create Event/i }));

    await waitFor(() => {
      expect(clientApi.createEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'My Event',
          location: 'Park',
        }),
      );
      expect(mockNavigate).toHaveBeenCalledWith('/events/123');
    });
  });
});
