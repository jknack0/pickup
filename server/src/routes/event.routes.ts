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
} from '@/controllers/event.controller.js';
import { authenticate as protect } from '@/middleware/auth.js';

const router = Router();

router.use(protect);

router.post('/', createEvent);
router.get('/mine', listMyEvents);
router.get('/:id', getEvent);
router.post('/:id/join', joinEvent);
router.patch('/:id/rsvp', updateRSVP);
router.put('/:id/cancel', cancelEvent);
router.delete('/:id/attendees/:userId', removeAttendee);
router.post('/:id/attendees', addAttendee);

export default router;
