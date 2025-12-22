import { render, screen, fireEvent, waitFor } from '@/test-utils';
import { CreateEventForm } from './index';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as clientApi from '@/api/client';
import { useNavigate } from 'react-router-dom';

// Mock API
vi.mock('@/api/client');

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

import type { AnyData } from '@pickup/shared';

// Mock LocationAutocomplete to avoid complex Google Maps logic
vi.mock('@/components/atoms/LocationAutocomplete/LocationAutocomplete', () => ({
  default: ({ onPlaceSelect }: { onPlaceSelect: (place: AnyData) => void }) => (
    <input
      aria-label="Location"
      onChange={(e) =>
        onPlaceSelect({
          name: e.target.value,
          formatted_address: e.target.value,
          geometry: {
            location: {
              lat: () => 40.7128,
              lng: () => -74.006,
            },
          },
        })
      }
    />
  ),
}));

describe('CreateEventForm', () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useNavigate as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockNavigate);
  });

  it('renders correctly', () => {
    render(<CreateEventForm />);
    expect(screen.getByLabelText(/Event Title/i)).toBeInTheDocument();
  });

  it('submits valid form data with coordinates', async () => {
    (clientApi.createEvent as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: { event: { _id: '123' } },
    });

    render(<CreateEventForm />);

    fireEvent.change(screen.getByLabelText(/Event Title/i), { target: { value: 'My Event' } });
    // Simulate location selection via mocked input which also generates coordinates now
    fireEvent.change(screen.getByLabelText(/Location/i), { target: { value: 'Park' } });
    fireEvent.change(screen.getByLabelText(/Date/i), { target: { value: '2025-01-01T12:00' } });

    fireEvent.click(screen.getByRole('button', { name: /Create Event/i }));

    await waitFor(() => {
      expect(clientApi.createEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'My Event',
          location: 'Park',
          coordinates: { lat: 40.7128, lng: -74.006 },
        }),
      );
      expect(mockNavigate).toHaveBeenCalledWith('/events/123');
    });
  });
});
