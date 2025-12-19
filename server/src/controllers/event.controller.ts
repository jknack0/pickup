import { Request, Response } from 'express';
import Event, { IEventDocument } from '@/models/Event.js';
import User from '@/models/User.js';
import { CreateEventInput, AttendeeStatus, EventStatus } from '@pickup/shared';
import { asyncHandler } from '@/utils/asyncHandler.js';
import { AppError } from '@/middleware/error.middleware.js';

interface AuthRequest extends Request {
  user?: {
    id: string;
  };
}

const isOrganizer = (event: IEventDocument, userId: string) =>
  event.organizer.toString() === userId;

export const createEvent = asyncHandler(async (req: Request, res: Response) => {
  const { title, description, date, location, type, format, coordinates } =
    req.body as CreateEventInput;
  const userId = (req as AuthRequest).user?.id;

  if (!userId) {
    throw new AppError('Unauthorized', 401);
  }

  const event = new Event({
    title,
    description,
    date,
    location,
    coordinates,
    type,
    format,
    organizer: userId,
    attendees: [{ user: userId, status: AttendeeStatus.YES, positions: [] }], // Organizer is automatically an attendee
  });

  await event.save();

  // Populate organizer details for the response
  await event.populate('organizer', 'firstName lastName email');
  await event.populate('attendees.user', 'firstName lastName email');

  res.status(201).json({ event });
});

export const getEvent = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const event = await Event.findById(id)
    .populate('organizer', 'firstName lastName email')
    .populate('attendees.user', 'firstName lastName email');

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

  // Find events where user is organizer OR is in attendees list (by checking attendees.user)
  const events = await Event.find({
    $or: [{ organizer: userId }, { 'attendees.user': userId }],
  })
    .sort({ date: 1 }) // Closest dates first
    .populate('organizer', 'firstName lastName email')
    .populate('attendees.user', 'firstName lastName email');

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

  event.attendees.push({
    user: userId,
    status: AttendeeStatus.YES,
    positions: positions || [], // Default to empty if not provided
    joinedAt: new Date(),
  });

  await event.save();

  // Re-populate for response
  await event.populate('attendees.user', 'firstName lastName email');

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
    throw new AppError('You differ not attending this event', 400);
  }

  // Update status
  event.attendees[attendeeIndex].status = status;

  await event.save();
  await event.populate('attendees.user', 'firstName lastName email');

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

  await event.populate('organizer', 'firstName lastName email');
  await event.populate('attendees.user', 'firstName lastName email');

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

  await event.populate('attendees.user', 'firstName lastName email');
  await event.populate('organizer', 'firstName lastName email');

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

  await event.populate('attendees.user', 'firstName lastName email');
  await event.populate('organizer', 'firstName lastName email');

  res.json({ message: 'Attendee added', event });
});
