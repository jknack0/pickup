import { Request, Response } from 'express';
import Event from '@/models/Event.js';
import { CreateEventInput, AttendeeStatus, EventStatus } from '@pickup/shared';
import logger from '@/utils/logger.js';

interface AuthRequest extends Request {
  user?: {
    id: string;
  };
}

export const createEvent = async (req: Request, res: Response) => {
  try {
    const { title, description, date, location, type, format, coordinates } =
      req.body as CreateEventInput;
    const userId = (req as AuthRequest).user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
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

export const cancelEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as AuthRequest).user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.organizer.toString() !== userId) {
      return res.status(403).json({ message: 'Only the organizer can cancel this event' });
    }

    event.status = EventStatus.CANCELED;
    await event.save();

    await event.populate('organizer', 'firstName lastName email');
    await event.populate('attendees.user', 'firstName lastName email');

    res.json({ message: 'Event canceled', event });
  } catch (error) {
    logger.error('Cancel event error', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const removeAttendee = async (req: Request, res: Response) => {
  try {
    const { id, userId: targetUserId } = req.params;
    const userId = (req as AuthRequest).user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.organizer.toString() !== userId) {
      return res.status(403).json({ message: 'Only the organizer can remove attendees' });
    }

    event.attendees = event.attendees.filter((att) => att.user.toString() !== targetUserId);
    await event.save();

    await event.populate('attendees.user', 'firstName lastName email');
    await event.populate('organizer', 'firstName lastName email');

    res.json({ message: 'Attendee removed', event });
  } catch (error) {
    logger.error('Remove attendee error', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Start of Add Attendee
import User from '@/models/User.js';

export const addAttendee = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { email } = req.body;
    const userId = (req as AuthRequest).user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.organizer.toString() !== userId) {
      return res.status(403).json({ message: 'Only the organizer can add attendees' });
    }

    const userToAdd = await User.findOne({ email });
    if (!userToAdd) {
      return res.status(404).json({ message: 'User with this email not found' });
    }

    if (event.attendees.some((att) => att.user.toString() === userToAdd._id.toString())) {
      return res.status(400).json({ message: 'User is already attending' });
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
  } catch (error) {
    logger.error('Add attendee error', error);
    res.status(500).json({ message: 'Server error' });
  }
};
