import { Request, Response } from 'express';
import Event from '@/models/Event.js';
import { CreateEventInput, AttendeeStatus } from '@pickup/shared';
import logger from '@/utils/logger.js';

interface AuthRequest extends Request {
  user?: {
    id: string;
  };
}

export const createEvent = async (req: Request, res: Response) => {
  try {
    const { title, description, date, location, type, format } = req.body as CreateEventInput;
    const userId = (req as AuthRequest).user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const event = new Event({
      title,
      description,
      date,
      location,
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
  } catch (error) {
    logger.error('Create event error', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id)
      .populate('organizer', 'firstName lastName email')
      .populate('attendees.user', 'firstName lastName email');

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json({ event });
  } catch (error) {
    logger.error('Get event error', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const listMyEvents = async (req: Request, res: Response) => {
  try {
    const userId = (req as AuthRequest).user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Find events where user is organizer OR is in attendees list (by checking attendees.user)
    const events = await Event.find({
      $or: [{ organizer: userId }, { 'attendees.user': userId }],
    })
      .sort({ date: 1 }) // Closest dates first
      .populate('organizer', 'firstName lastName email')
      .populate('attendees.user', 'firstName lastName email');

    res.json({ events });
  } catch (error) {
    logger.error('List my events error', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const joinEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { positions } = req.body; // Expect positions in body
    const userId = (req as AuthRequest).user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if user is already attending
    if (event.attendees.some((att) => att.user.toString() === userId)) {
      return res.status(400).json({ message: 'You have already joined this event' });
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
  } catch (error) {
    logger.error('Join event error', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateRSVP = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = (req as AuthRequest).user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const attendeeIndex = event.attendees.findIndex((att) => att.user.toString() === userId);
    if (attendeeIndex === -1) {
      return res.status(400).json({ message: 'You differ not attending this event' });
    }

    // Update status
    event.attendees[attendeeIndex].status = status;

    await event.save();
    await event.populate('attendees.user', 'firstName lastName email');

    res.json({ message: 'RSVP updated', event });
  } catch (error) {
    logger.error('Update RSVP error', error);
    res.status(500).json({ message: 'Server error' });
  }
};
