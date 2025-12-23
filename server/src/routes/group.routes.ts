import { Router } from 'express';
import {
  createGroup,
  getGroup,
  updateGroup,
  deleteGroup,
  transferOwnership,
  listMyGroups,
  listPublicGroups,
  joinGroup,
  requestToJoin,
  handleMembershipRequest,
  removeMember,
  updateMemberRole,
  leaveGroup,
  regenerateInviteCode,
  getGroupEvents,
} from '@/controllers/group.controller.js';
import { authenticate } from '@/middleware/auth.js';
import { validate } from '@/middleware/validation.js';
import {
  CreateGroupSchema,
  UpdateGroupSchema,
  HandleMembershipRequestSchema,
  TransferOwnershipSchema,
  UpdateMemberRoleSchema,
  JoinGroupSchema,
} from '@pickup/shared';

const router = Router();

// Public routes (no auth required, but may check auth for visibility)
router.get('/public', listPublicGroups);

// Protected routes
router.use(authenticate);

// Specific routes MUST come before parameterized routes
router.post('/', validate(CreateGroupSchema), createGroup);
router.get('/mine', listMyGroups);

// Parameterized routes
router.get('/:id', getGroup);
router.get('/:id/events', getGroupEvents);
router.patch('/:id', validate(UpdateGroupSchema), updateGroup);
router.delete('/:id', deleteGroup);
router.post('/:id/transfer', validate(TransferOwnershipSchema), transferOwnership);
router.post('/:id/join', validate(JoinGroupSchema), joinGroup);
router.post('/:id/request', requestToJoin);
router.post(
  '/:id/requests/:userId',
  validate(HandleMembershipRequestSchema),
  handleMembershipRequest,
);
router.delete('/:id/members/:userId', removeMember);
router.patch('/:id/members/:userId/role', validate(UpdateMemberRoleSchema), updateMemberRole);
router.post('/:id/leave', leaveGroup);
router.post('/:id/invite-code', regenerateInviteCode);

export default router;
