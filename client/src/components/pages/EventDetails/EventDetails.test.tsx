import { render, waitFor, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import EventDetails from './EventDetails';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import * as clientApi from '@/api/client';
import * as authHooks from '@/hooks/useAuth';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SnackbarProvider } from 'notistack';

vi.mock('@/api/client');
vi.mock('@/hooks/useAuth');

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

describe('EventDetails Invitation Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (authHooks.useUser as unknown as Mock).mockReturnValue({
      data: { user: { _id: 'user123' } },
    });
  });

  it('calls joinEvent when ?join=true is present', async () => {
    const mockEvent = {
      _id: '123',
      title: 'Test Event',
      date: new Date().toISOString(),
      location: 'Test Location',
      attendees: [],
      organizer: { firstName: 'John' },
      type: 'VOLLEYBALL',
      format: 'OPEN_GYM',
    };

    (clientApi.getEvent as unknown as Mock).mockResolvedValue({ data: { event: mockEvent } });
    (clientApi.joinEvent as unknown as Mock).mockResolvedValue({ data: { message: 'Joined' } });

    const client = createTestQueryClient();

    render(
      <QueryClientProvider client={client}>
        <SnackbarProvider>
          <MemoryRouter initialEntries={['/events/123?join=true']}>
            <Routes>
              <Route path="/events/:id" element={<EventDetails />} />
            </Routes>
          </MemoryRouter>
        </SnackbarProvider>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      // Dialog should open for VOLLEYBALL
      expect(screen.getByText('Select Positions')).toBeInTheDocument();
    });

    // Select a position (optional but good for realism)
    fireEvent.click(screen.getByLabelText('Setter'));

    // Confirm
    fireEvent.click(screen.getByText('Confirm & Join'));

    await waitFor(() => {
      expect(clientApi.joinEvent).toHaveBeenCalledWith('123', ['Setter']);
    });
  });
});
