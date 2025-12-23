/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import * as groupController from '../group.controller.js';
import Group from '@/models/Group.js';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import User from '@/models/User.js';

// Mock dependencies
jest.mock('@/models/Group.js');
jest.mock('@/models/User.js');
jest.mock('@/utils/logger.js');

jest.mock('@pickup/shared', () => ({
  GroupRole: { ADMIN: 'ADMIN', MEMBER: 'MEMBER', MODERATOR: 'MODERATOR' },
  GroupVisibility: { PUBLIC: 'PUBLIC', PRIVATE: 'PRIVATE' },
  GroupJoinPolicy: { OPEN: 'OPEN', REQUEST: 'REQUEST', INVITE_ONLY: 'INVITE_ONLY' },
  MembershipRequestStatus: { PENDING: 'PENDING', APPROVED: 'APPROVED', REJECTED: 'REJECTED' },
  EventType: { VOLLEYBALL: 'VOLLEYBALL' },
  EventFormat: { OPEN_GYM: 'OPEN_GYM' },
  EventPosition: { SETTER: 'Setter' },
  AttendeeStatus: { YES: 'YES', NO: 'NO', MAYBE: 'MAYBE', WAITLIST: 'WAITLIST' },
  EventStatus: { ACTIVE: 'ACTIVE', CANCELED: 'CANCELED' },
  USER_PUBLIC_FIELDS: 'firstName lastName email',
}));

describe('Group Controller', () => {
  let mockRequest: Partial<Request> & { user?: { id: string } };
  let mockResponse: Partial<Response>;
  let mockNext: jest.Mock;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });

    mockNext = jest.fn().mockImplementation((error: any) => {
      if (error) {
        statusMock(error.statusCode || 500).json({ message: error.message || 'Server Error' });
      }
    });

    mockResponse = {
      status: statusMock,
      json: jsonMock,
    } as unknown as Response;
    mockRequest = {
      user: { id: 'user123' },
      body: {},
      params: {},
    };
    jest.clearAllMocks();
  });

  describe('getGroup', () => {
    it('should return group if user is a member (populated fields)', async () => {
      mockRequest.params = { id: 'group123' };

      // Mock a group where fields ARE populated (objects with _id)
      const mockGroup = {
        _id: 'group123',
        owner: { _id: 'owner456' }, // Populated owner
        members: [
          { user: { _id: 'owner456' }, role: 'ADMIN' },
          { user: { _id: 'user123' }, role: 'MEMBER' }, // Populated user matching request user
        ],
        visibility: 'PRIVATE',
      };

      const mockPopulate2 = jest.fn().mockResolvedValue(mockGroup);
      const mockPopulate1 = jest.fn().mockReturnValue({ populate: mockPopulate2 });
      (Group.findById as any).mockReturnValue({ populate: mockPopulate1 });

      await groupController.getGroup(
        mockRequest as unknown as Request,
        mockResponse as unknown as Response,
        mockNext,
      );

      expect(Group.findById).toHaveBeenCalledWith('group123');
      expect(jsonMock).toHaveBeenCalledWith({ group: mockGroup });
    });

    it('should return group if user is a member (unpopulated fields)', async () => {
      mockRequest.params = { id: 'group123' };

      // Mock a group where fields are NOT populated (string IDs)
      const mockGroup = {
        _id: 'group123',
        owner: 'owner456',
        members: [
          { user: 'owner456', role: 'ADMIN' },
          { user: 'user123', role: 'MEMBER' },
        ],
        visibility: 'PRIVATE',
      };

      const mockPopulate2 = jest.fn().mockResolvedValue(mockGroup);
      const mockPopulate1 = jest.fn().mockReturnValue({ populate: mockPopulate2 });
      (Group.findById as any).mockReturnValue({ populate: mockPopulate1 });

      await groupController.getGroup(
        mockRequest as unknown as Request,
        mockResponse as unknown as Response,
        mockNext,
      );

      expect(jsonMock).toHaveBeenCalledWith({ group: mockGroup });
    });

    it('should throw 404 for PRIVATE group if user is NOT a member', async () => {
      mockRequest.params = { id: 'group123' };
      mockRequest.user = { id: 'outsider789' };

      const mockGroup = {
        _id: 'group123',
        owner: { _id: 'owner456' },
        members: [{ user: { _id: 'owner456' }, role: 'ADMIN' }],
        visibility: 'PRIVATE',
      };

      const mockPopulate2 = jest.fn().mockResolvedValue(mockGroup);
      const mockPopulate1 = jest.fn().mockReturnValue({ populate: mockPopulate2 });
      (Group.findById as any).mockReturnValue({ populate: mockPopulate1 });

      await groupController.getGroup(
        mockRequest as unknown as Request,
        mockResponse as unknown as Response,
        mockNext,
      );

      expect(statusMock).toHaveBeenCalledWith(404);
    });
  });
});
