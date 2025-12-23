import { Request, Response } from 'express';
import Event, { IEventDocument } from '@/models/Event.js';
import User from '@/models/User.js';
import Group from '@/models/Group.js';
import {
  CreateEventInput,
  AttendeeStatus,
  EventStatus,
  AuthRequest,
  USER_PUBLIC_FIELDS,
  RefundInfo,
  GroupRole,
} from '@pickup/shared';
import { asyncHandler } from '@/utils/asyncHandler.js';
import { AppError } from '@/middleware/error.middleware.js';
import { processRefund } from '@/controllers/payment.controller.js';

const isOrganizer = (event: IEventDocument, userId: string) =>
  event.organizer.toString() === userId;

export const createEvent = asyncHandler(async (req: Request, res: Response) => {
  const {
    title,
    description,
    date,
    location,
    type,
    format,
    coordinates,
    isPaid,
    price,
    currency,
    groupId,
    isPublic,
  } = req.body as CreateEventInput & { groupId?: string; isPublic?: boolean };
  const userId = (req as AuthRequest).user?.id;

  if (!userId) {
    throw new AppError('Unauthorized', 401);
  }

  // If creating within a group, verify permissions
  let finalPrice = price;
  let finalCurrency = currency;
  if (groupId) {
    const group = await Group.findById(groupId);
    if (!group) {
      throw new AppError('Group not found', 404);
    }

    // Check if user is Admin or Moderator in the group
    const member = group.members.find((m) => m.user.toString() === userId);
    if (!member || (member.role !== GroupRole.ADMIN && member.role !== GroupRole.MODERATOR)) {
      throw new AppError('Only admins and moderators can create events in this group', 403);
    }

    // Inherit payment settings from group if not specified
    if (isPaid && group.paymentSettings?.stripeAccountId) {
      if (!price && group.paymentSettings.defaultPrice) {
        finalPrice = group.paymentSettings.defaultPrice;
      }
      if (!currency && group.paymentSettings.defaultCurrency) {
        finalCurrency = group.paymentSettings.defaultCurrency;
      }
    }
  }

  const event = new Event({
    title,
    description,
    date,
    location,
    coordinates,
    type,
    format,
    isPaid,
    price: finalPrice,
    currency: finalCurrency,
    organizer: userId,
    attendees: [{ user: userId, status: AttendeeStatus.YES, positions: [] }],
    group: groupId || undefined,
    isPublic: isPublic ?? true,
  });

  await event.save();

  // Populate organizer details for the response
  await event.populate('organizer', USER_PUBLIC_FIELDS);
  await event.populate('attendees.user', USER_PUBLIC_FIELDS);

  res.status(201).json({ event });
});

export const getEvent = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const event = await Event.findById(id)
    .populate('organizer', USER_PUBLIC_FIELDS)
    .populate('attendees.user', USER_PUBLIC_FIELDS);

  if (!event) {
    throw new AppError('Event not found', 404);
  }

  res.json({ event });
});

export const listMyEvents = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as AuthRequest).user?.id;
  if (!userId) {
    throw new AppError('Unauthorized', 401);
  }

  // Find groups user is a member of
  const userGroups = await Group.find({ 'members.user': userId }).select('_id');
  const groupIds = userGroups.map((g) => g._id.toString());

  // Find events where:
  // 1. User is organizer
  // 2. User is in attendees list
  // 3. Event belongs to a group user is a member of
  const events = await Event.find({
    $or: [
      { organizer: userId },
      { 'attendees.user': userId },
      ...(groupIds.length > 0 ? [{ group: { $in: groupIds } }] : []),
    ],
  })
    .sort({ date: 1 }) // Closest dates first
    .populate('organizer', USER_PUBLIC_FIELDS)
    .populate('attendees.user', USER_PUBLIC_FIELDS)
    .populate('group', 'name');

  res.json({ events });
});

export const joinEvent = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { positions } = req.body; // Expect positions in body
  const userId = (req as AuthRequest).user?.id;

  if (!userId) {
    throw new AppError('Unauthorized', 401);
  }

  const event = await Event.findById(id);
  if (!event) {
    throw new AppError('Event not found', 404);
  }

  // Check if user is already attending
  if (event.attendees.some((att) => att.user.toString() === userId)) {
    throw new AppError('You have already joined this event', 400);
  }

  // Block direct join for paid events
  if (event.isPaid) {
    throw new AppError('This event requires payment. Please use the checkout flow.', 402);
  }

  event.attendees.push({
    user: userId,
    status: AttendeeStatus.YES,
    positions: positions || [], // Default to empty if not provided
    joinedAt: new Date(),
  });

  await event.save();

  // Re-populate for response
  await event.populate('attendees.user', USER_PUBLIC_FIELDS);

  res.json({ message: 'Joined event successfully', event });
});

export const updateRSVP = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  const userId = (req as AuthRequest).user?.id;

  if (!userId) {
    throw new AppError('Unauthorized', 401);
  }

  const event = await Event.findById(id);
  if (!event) {
    throw new AppError('Event not found', 404);
  }

  const attendeeIndex = event.attendees.findIndex((att) => att.user.toString() === userId);
  if (attendeeIndex === -1) {
    throw new AppError('You are not attending this event', 400);
  }

  // Update status
  event.attendees[attendeeIndex].status = status;

  await event.save();
  await event.populate('attendees.user', USER_PUBLIC_FIELDS);

  res.json({ message: 'RSVP updated', event });
});

export const cancelEvent = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = (req as AuthRequest).user?.id;

  if (!userId) {
    throw new AppError('Unauthorized', 401);
  }

  const event = await Event.findById(id);
  if (!event) {
    throw new AppError('Event not found', 404);
  }

  if (!isOrganizer(event, userId)) {
    throw new AppError('Only the organizer can cancel this event', 403);
  }

  event.status = EventStatus.CANCELED;
  await event.save();

  await event.populate('organizer', USER_PUBLIC_FIELDS);
  await event.populate('attendees.user', USER_PUBLIC_FIELDS);

  res.json({ message: 'Event canceled', event });
});

export const removeAttendee = asyncHandler(async (req: Request, res: Response) => {
  const { id, userId: targetUserId } = req.params;
  const userId = (req as AuthRequest).user?.id;

  if (!userId) {
    throw new AppError('Unauthorized', 401);
  }

  const event = await Event.findById(id);
  if (!event) {
    throw new AppError('Event not found', 404);
  }

  if (!isOrganizer(event, userId)) {
    throw new AppError('Only the organizer can remove attendees', 403);
  }

  event.attendees = event.attendees.filter((att) => att.user.toString() !== targetUserId);
  await event.save();

  await event.populate('attendees.user', USER_PUBLIC_FIELDS);
  await event.populate('organizer', USER_PUBLIC_FIELDS);

  res.json({ message: 'Attendee removed', event });
});

export const addAttendee = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { email } = req.body;
  const userId = (req as AuthRequest).user?.id;

  if (!userId) {
    throw new AppError('Unauthorized', 401);
  }

  const event = await Event.findById(id);
  if (!event) {
    throw new AppError('Event not found', 404);
  }

  if (!isOrganizer(event, userId)) {
    throw new AppError('Only the organizer can add attendees', 403);
  }

  const userToAdd = await User.findOne({ email });
  if (!userToAdd) {
    throw new AppError('User with this email not found', 404);
  }

  if (event.attendees.some((att) => att.user.toString() === userToAdd._id.toString())) {
    throw new AppError('User is already attending', 400);
  }

  event.attendees.push({
    user: userToAdd._id.toString(), // Store as string if interface expects string
    status: AttendeeStatus.YES,
    positions: [],
    joinedAt: new Date(),
  });

  await event.save();

  await event.populate('attendees.user', USER_PUBLIC_FIELDS);
  await event.populate('organizer', USER_PUBLIC_FIELDS);

  res.json({ message: 'Attendee added', event });
});

export const leaveEvent = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = (req as AuthRequest).user?.id;

  if (!userId) {
    throw new AppError('Unauthorized', 401);
  }

  const event = await Event.findById(id);
  if (!event) {
    throw new AppError('Event not found', 404);
  }

  const attendee = event.attendees.find((att) => att.user.toString() === userId);
  if (!attendee) {
    throw new AppError('You are not attending this event', 400);
  }

  // Refund info to return to client
  let refundInfo: RefundInfo = { refunded: false };

  // Handle Payment Refund if applicable
  if (event.isPaid) {
    try {
      const result = await processRefund(userId, id);
      if (result) {
        refundInfo = {
          refunded: true,
          amount: result.amount,
          currency: result.currency,
        };
      } else {
        // No payment found to refund (e.g., organizer added them manually)
        refundInfo = { refunded: false, reason: 'no_payment' };
      }
    } catch (err) {
      // Check if it's the "Too late" error, if so, we might still allow leaving but without refund?
      // User specs: "a user that has paid is able to leave an event up to 24 hours before the event with no penalty, when a user leaves the event before then they are refunded"
      // Implies if < 24h, they can leave but NO REFUND? Or they CANNOT leave?
      // "a user... is able to leave... up to 24 hours... with no penalty"
      // Usually implies after that there IS a penalty (no refund).
      // So if processRefund throws "Too late", we catch it and proceed to remove attendee (no refund).
      // If it throws other errors (stripe error), maybe block?
      const msg = (err as Error).message;
      if (msg.includes('Too late')) {
        // Proceed without refund - past the 24h deadline
        refundInfo = { refunded: false, reason: 'past_deadline' };
      } else if (msg.includes('Refund amount is zero')) {
        // Proceed without refund - amount too small after fees
        refundInfo = { refunded: false, reason: 'zero_amount' };
      } else {
        // Real error
        throw err;
      }
    }
  }

  // Remove attendee
  event.attendees = event.attendees.filter((att) => att.user.toString() !== userId);
  await event.save();

  // Re-populate
  await event.populate('attendees.user', USER_PUBLIC_FIELDS);

  res.json({ message: 'Left event successfully', event, refund: refundInfo });
});
