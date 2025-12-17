import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { Request, Response } from 'express';
import * as eventController from '../event.controller.js';
import Event from '@/models/Event.js';

// Mock dependencies
jest.mock('@/models/Event.js');
jest.mock('@/utils/logger.js');
jest.mock('@pickup/shared', () => ({
  EventType: { VOLLEYBALL: 'VOLLEYBALL' },
  EventFormat: { OPEN_GYM: 'OPEN_GYM' },
  EventPosition: { SETTER: 'Setter' },
  AttendeeStatus: { YES: 'YES', NO: 'NO', MAYBE: 'MAYBE', WAITLIST: 'WAITLIST' },
  EventStatus: { ACTIVE: 'ACTIVE', CANCELED: 'CANCELED' },
}));

describe('Event Controller - RSVP', () => {
  let mockRequest: Partial<Request> & { user?: { id: string } };
  let mockResponse: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });
    mockResponse = {
      status: statusMock,
      json: jsonMock,
    } as unknown as Response;
    mockRequest = {
      user: { id: 'user123' },
      body: {},
      params: {},
    };
  });

  describe('updateRSVP', () => {
    it('should update attendee status successfully', async () => {
      mockRequest.params = { id: 'event123' };
      mockRequest.body = { status: 'NO' };

      const eventWithArray = {
        attendees: [{ user: 'user123', status: 'YES' }],
        save: jest.fn(),
        populate: jest.fn(),
      };

      // Correct generic type to match expected Promise return
      (Event.findById as unknown as jest.Mock<() => Promise<unknown>>).mockResolvedValue(
        eventWithArray,
      );

      await eventController.updateRSVP(mockRequest as Request, mockResponse as Response);

      expect(eventWithArray.attendees[0].status).toBe('NO');
      expect(eventWithArray.save).toHaveBeenCalled();
      expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({ message: 'RSVP updated' }));
    });

    it('should fail if user is not an attendee', async () => {
      mockRequest.params = { id: 'event123' };
      const eventWithArray = {
        attendees: [{ user: 'otherUser', status: 'YES' }],
        save: jest.fn(),
        populate: jest.fn(),
      };
      (Event.findById as unknown as jest.Mock<() => Promise<unknown>>).mockResolvedValue(
        eventWithArray,
      );

      await eventController.updateRSVP(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'You differ not attending this event' }),
      );
    });
  });
});
