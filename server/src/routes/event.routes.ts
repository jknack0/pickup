import { Router } from 'express';
import {
  createEvent,
  getEvent,
  listMyEvents,
  joinEvent,
  updateRSVP,
  cancelEvent,
  removeAttendee,
  addAttendee,
  leaveEvent,
} from '@/controllers/event.controller.js';
import { authenticate as protect } from '@/middleware/auth.js';
import { validate } from '@/middleware/validation.js';
import {
  CreateEventSchema,
  JoinEventSchema,
  UpdateRSVPSchema,
  AddAttendeeSchema,
} from '@pickup/shared';

const router = Router();

router.use(protect);

router.post('/', validate(CreateEventSchema), createEvent);
router.get('/mine', listMyEvents);
router.get('/:id', getEvent);
router.post('/:id/join', validate(JoinEventSchema), joinEvent);
router.post('/:id/leave', leaveEvent);
router.patch('/:id/rsvp', validate(UpdateRSVPSchema), updateRSVP);
router.put('/:id/cancel', cancelEvent);
router.delete('/:id/attendees/:userId', removeAttendee);
router.post('/:id/attendees', validate(AddAttendeeSchema), addAttendee);

export default router;
