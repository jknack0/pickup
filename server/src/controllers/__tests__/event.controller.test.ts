import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { Request, Response } from 'express';
import * as eventController from '../event.controller.js';
import Event from '@/models/Event.js';
import User from '@/models/User.js';

// Mock dependencies
jest.mock('@/models/Event.js');
jest.mock('@/models/User.js');
jest.mock('@/utils/logger.js');
jest.mock('@pickup/shared', () => ({
  EventType: { VOLLEYBALL: 'VOLLEYBALL' },
  EventFormat: { OPEN_GYM: 'OPEN_GYM' },
  EventPosition: { SETTER: 'Setter' },
  AttendeeStatus: { YES: 'YES', NO: 'NO', MAYBE: 'MAYBE', WAITLIST: 'WAITLIST' },
  EventStatus: { ACTIVE: 'ACTIVE', CANCELED: 'CANCELED' },
}));

describe('Event Controller', () => {
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

  describe('createEvent', () => {
    it('should create an event successfully', async () => {
      mockRequest.body = {
        title: 'Volleyball Match',
        date: '2025-01-01',
        location: 'Beach',
        coordinates: { lat: 10, lng: 20 },
        description: 'Fun game',
      };

      const mockSave = jest.fn();
      const mockPopulate = jest.fn();

      // Mock Event constructor and instance methods
      (Event as unknown as jest.Mock).mockImplementation(() => ({
        save: mockSave,
        populate: mockPopulate,
        toJSON: () => mockRequest.body,
      }));

      await eventController.createEvent(mockRequest as Request, mockResponse as Response);

      expect(Event).toHaveBeenCalledWith({
        ...mockRequest.body,
        organizer: 'user123',
        attendees: [{ user: 'user123', status: 'YES', positions: [] }],
      });
      expect(mockSave).toHaveBeenCalled();
      expect(mockPopulate).toHaveBeenCalledWith('organizer', 'firstName lastName email');
      expect(mockPopulate).toHaveBeenCalledWith('attendees.user', 'firstName lastName email');
      expect(statusMock).toHaveBeenCalledWith(201);
    });

    it('should return 401 if user is not authenticated', async () => {
      mockRequest.user = undefined;
      await eventController.createEvent(mockRequest as Request, mockResponse as Response);
      expect(statusMock).toHaveBeenCalledWith(401);
    });
  });

  describe('getEvent', () => {
    it('should return event content if found', async () => {
      mockRequest.params = { id: 'event123' };
      const mockEvent = { title: 'Found Event' };

      const mockPopulate2 = jest
        .fn<(...args: unknown[]) => Promise<unknown>>()
        .mockResolvedValue(mockEvent);
      // Declare mockPopulate1 before using it
      const mockPopulate1 = jest.fn<(...args: unknown[]) => { populate: typeof mockPopulate2 }>();
      mockPopulate1.mockReturnValue({ populate: mockPopulate2 });

      (Event.findById as unknown as jest.Mock).mockReturnValue({ populate: mockPopulate1 });

      await eventController.getEvent(mockRequest as Request, mockResponse as Response);

      expect(Event.findById).toHaveBeenCalledWith('event123');
      expect(mockPopulate1).toHaveBeenCalledWith('organizer', 'firstName lastName email');
      expect(mockPopulate2).toHaveBeenCalledWith('attendees.user', 'firstName lastName email');
      expect(jsonMock).toHaveBeenCalledWith({ event: mockEvent });
    });

    it('should return 404 if event not found', async () => {
      mockRequest.params = { id: 'event123' };

      const mockPopulate2 = jest
        .fn<(...args: unknown[]) => Promise<unknown>>()
        .mockResolvedValue(null);
      const mockPopulate1 = jest.fn<(...args: unknown[]) => { populate: typeof mockPopulate2 }>();
      mockPopulate1.mockReturnValue({ populate: mockPopulate2 });

      (Event.findById as unknown as jest.Mock).mockReturnValue({ populate: mockPopulate1 });

      await eventController.getEvent(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(404);
    });
  });

  describe('joinEvent', () => {
    it('should add user to attendees with positions', async () => {
      mockRequest.params = { id: 'event123' };
      mockRequest.body = { positions: ['Setter'] };

      const mockEvent = {
        attendees: [],
        save: jest.fn(),
        populate: jest.fn(),
      };

      // Ensure proper typing for Mongoose resolves
      (Event.findById as unknown as jest.Mock<() => Promise<unknown>>).mockResolvedValue(mockEvent);

      await eventController.joinEvent(mockRequest as Request, mockResponse as Response);

      expect(mockEvent.attendees).toHaveLength(1);
      expect(mockEvent.attendees[0]).toEqual(
        expect.objectContaining({
          user: 'user123',
          status: 'YES',
          positions: ['Setter'],
        }),
      );
      expect(mockEvent.save).toHaveBeenCalled();
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Joined event successfully' }),
      );
    });
    it('should fail if already joined', async () => {
      mockRequest.params = { id: 'event123' };
      const mockEvent = {
        attendees: [{ user: 'user123' }], // Already present
      };
      (Event.findById as unknown as jest.Mock<() => Promise<unknown>>).mockResolvedValue(mockEvent);

      await eventController.joinEvent(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
    });
  });

  describe('cancelEvent', () => {
    it('should update status to CANCELED if user is organizer', async () => {
      mockRequest.params = { id: 'event123' };
      const mockEvent = {
        organizer: 'user123',
        status: 'ACTIVE',
        save: jest.fn(),
        populate: jest.fn(),
      };
      (Event.findById as unknown as jest.Mock<() => Promise<unknown>>).mockResolvedValue(mockEvent);

      await eventController.cancelEvent(mockRequest as Request, mockResponse as Response);

      expect(mockEvent.status).toBe('CANCELED');
      expect(mockEvent.save).toHaveBeenCalled();
      expect(mockEvent.populate).toHaveBeenCalledTimes(2);
      expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({ message: 'Event canceled' }));
    });

    it('should return 403 if user is not organizer', async () => {
      mockRequest.params = { id: 'event123' };
      mockRequest.user = { id: 'otherUser' };
      const mockEvent = {
        organizer: 'user123',
        status: 'ACTIVE',
      };
      (Event.findById as unknown as jest.Mock<() => Promise<unknown>>).mockResolvedValue(mockEvent);

      await eventController.cancelEvent(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(403);
    });
  });

  describe('removeAttendee', () => {
    it('should remove attendee if user is organizer', async () => {
      mockRequest.params = { id: 'event123', userId: 'targetUser' };
      const mockEvent = {
        organizer: 'user123',
        attendees: [{ user: 'user123' }, { user: 'targetUser' }],
        save: jest.fn(),
        populate: jest.fn(),
      };
      (Event.findById as unknown as jest.Mock<() => Promise<unknown>>).mockResolvedValue(mockEvent);

      await eventController.removeAttendee(mockRequest as Request, mockResponse as Response);

      expect(mockEvent.attendees).toHaveLength(1);
      expect(mockEvent.attendees[0].user).toBe('user123'); // Target removed
      expect(mockEvent.save).toHaveBeenCalled();
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Attendee removed' }),
      );
    });

    it('should return 403 if user is not organizer', async () => {
      mockRequest.params = { id: 'event123', userId: 'targetUser' };
      mockRequest.user = { id: 'otherUser' };
      const mockEvent = {
        organizer: 'user123',
        attendees: [],
      };
      (Event.findById as unknown as jest.Mock<() => Promise<unknown>>).mockResolvedValue(mockEvent);

      await eventController.removeAttendee(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(403);
    });
  });

  describe('addAttendee', () => {
    it('should add attendee by email if user is organizer', async () => {
      mockRequest.params = { id: 'event123' };
      mockRequest.body = { email: 'new@example.com' };

      const mockEvent = {
        organizer: 'user123',
        attendees: [] as { user: unknown }[], // Explicit cast to allow pushing
        save: jest.fn(),
        populate: jest.fn(),
      };
      const mockUserToAdd = { _id: 'newUser456', id: 'newUser456' };

      (Event.findById as unknown as jest.Mock<() => Promise<unknown>>).mockResolvedValue(mockEvent);
      (User.findOne as unknown as jest.Mock<() => Promise<unknown>>).mockResolvedValue(
        mockUserToAdd,
      );

      await eventController.addAttendee(mockRequest as Request, mockResponse as Response);

      expect(mockEvent.attendees).toHaveLength(1);
      expect(mockEvent.attendees[0].user).toBe('newUser456');
      expect(mockEvent.save).toHaveBeenCalled();
      expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({ message: 'Attendee added' }));
    });

    it('should fail if user to add does not exist', async () => {
      mockRequest.params = { id: 'event123' };
      mockRequest.body = { email: 'ghost@example.com' };
      const mockEvent = { organizer: 'user123', attendees: [] };

      (Event.findById as unknown as jest.Mock<() => Promise<unknown>>).mockResolvedValue(mockEvent);
      (User.findOne as unknown as jest.Mock<() => Promise<unknown>>).mockResolvedValue(null);

      await eventController.addAttendee(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(404);
    });
  });
});
