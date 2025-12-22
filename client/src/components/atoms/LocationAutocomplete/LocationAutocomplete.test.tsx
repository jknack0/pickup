import { render, screen, fireEvent, waitFor } from '@/test-utils';
import LocationAutocomplete from './LocationAutocomplete';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { APIProvider } from '@vis.gl/react-google-maps';

// Mock useMapsLibrary before imports or in vi.mock
vi.mock('@vis.gl/react-google-maps', async () => {
  const actual = await vi.importActual('@vis.gl/react-google-maps');
  return {
    ...actual,
    useMapsLibrary: () => globalThis.google?.maps?.places,
  };
});

// Mock Google Maps API
const mockGetPlacePredictions = vi.fn();
const mockGetDetails = vi.fn();

const setupGoogleMock = () => {
  globalThis.google = {
    maps: {
      places: {
        AutocompleteService: vi.fn().mockImplementation(function (this: unknown) {
          return { getPlacePredictions: mockGetPlacePredictions };
        }),
        PlacesService: vi.fn().mockImplementation(function (this: unknown) {
          return { getDetails: mockGetDetails };
        }),
        AutocompleteSessionToken: vi.fn(),
        PlacesServiceStatus: {
          OK: 'OK',
        },
      },
    },
  } as unknown as typeof google;
};

describe('LocationAutocomplete', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setupGoogleMock();
  });

  it('renders input field', () => {
    render(
      <APIProvider apiKey="test-key">
        <LocationAutocomplete onPlaceSelect={vi.fn()} />
      </APIProvider>,
    );
    expect(screen.getByLabelText(/location/i)).toBeInTheDocument();
  });

  it('updates input value on change', async () => {
    render(
      <APIProvider apiKey="test-key">
        <LocationAutocomplete onPlaceSelect={vi.fn()} />
      </APIProvider>,
    );

    const input = screen.getByLabelText(/location/i);
    fireEvent.change(input, { target: { value: 'New York' } });

    await waitFor(() => {
      expect(mockGetPlacePredictions).toHaveBeenCalled();
    });
  });
});
