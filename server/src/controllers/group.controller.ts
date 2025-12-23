import { Request, Response } from 'express';
import { randomBytes } from 'crypto';
import Group, { IGroupDocument } from '@/models/Group.js';
import User from '@/models/User.js';
import Event from '@/models/Event.js';
import {
  CreateGroupInput,
  UpdateGroupInput,
  HandleMembershipRequestInput,
  TransferOwnershipInput,
  UpdateMemberRoleInput,
  JoinGroupInput,
  GroupRole,
  GroupVisibility,
  GroupJoinPolicy,
  MembershipRequestStatus,
  AuthRequest,
  USER_PUBLIC_FIELDS,
  GROUP_DEFAULTS,
} from '@pickup/shared';
import { asyncHandler } from '@/utils/asyncHandler.js';
import { AppError } from '@/middleware/error.middleware.js';

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Safely extract user ID from a potential string or populated user object
 */
import { Types } from 'mongoose';

/**
 * Safely extract user ID from a potential string or populated user object
 */
type UserRef = string | Types.ObjectId | { _id: string | Types.ObjectId } | unknown;

const getUserId = (user: UserRef): string => {
  if (!user) return '';
  if (typeof user === 'string') return user;
  if (user instanceof Types.ObjectId) return user.toString();
  if (typeof user === 'object' && '_id' in user) {
    return (user as { _id: string | Types.ObjectId })._id.toString();
  }
  return String(user);
};

/**
 * Check if user is the owner of the group
 */
const isOwner = (group: IGroupDocument, userId: string): boolean => {
  return getUserId(group.owner) === userId;
};

/**
 * Get user's role in a group
 */
const getMemberRole = (group: IGroupDocument, userId: string): GroupRole | null => {
  const member = group.members.find((m) => getUserId(m.user) === userId);
  return member ? member.role : null;
};

/**
 * Check if user has at least the specified role (Admin > Moderator > Member)
 */
const hasRole = (group: IGroupDocument, userId: string, minRole: GroupRole): boolean => {
  const role = getMemberRole(group, userId);
  if (!role) return false;

  const roleHierarchy: Record<GroupRole, number> = {
    [GroupRole.ADMIN]: 3,
    [GroupRole.MODERATOR]: 2,
    [GroupRole.MEMBER]: 1,
  };

  return roleHierarchy[role] >= roleHierarchy[minRole];
};

/**
 * Check if user can modify another user's membership
 */
const canModifyMember = (group: IGroupDocument, actorId: string, targetId: string): boolean => {
  // Can't modify owner
  if (isOwner(group, targetId)) return false;

  const actorRole = getMemberRole(group, actorId);
  const targetRole = getMemberRole(group, targetId);

  if (!actorRole || !targetRole) return false;

  // Owners/Admins can modify anyone except owner
  if (isOwner(group, actorId) || actorRole === GroupRole.ADMIN) {
    return !isOwner(group, targetId);
  }

  // Moderators can only modify Members
  if (actorRole === GroupRole.MODERATOR) {
    return targetRole === GroupRole.MEMBER;
  }

  return false;
};

/**
 * Generate a unique invite code
 */
const generateInviteCode = (): string => {
  return randomBytes(8).toString('hex');
};

// ============================================================================
// CONTROLLER FUNCTIONS
// ============================================================================

/**
 * Create a new group
 * POST /api/groups
 */
export const createGroup = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as AuthRequest).user?.id;
  if (!userId) {
    throw new AppError('Unauthorized', 401);
  }

  const input = req.body as CreateGroupInput;

  // Get user's Stripe account for payment settings
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  const group = await Group.create({
    ...input,
    owner: userId,
    members: [
      {
        user: userId,
        role: GroupRole.ADMIN,
        joinedAt: new Date(),
      },
    ],
    inviteCode: generateInviteCode(),
    paymentSettings: user.stripeAccountId
      ? {
          stripeAccountId: user.stripeAccountId,
          defaultCurrency: GROUP_DEFAULTS.CURRENCY,
        }
      : undefined,
  });

  await group.populate('owner', USER_PUBLIC_FIELDS);
  await group.populate('members.user', USER_PUBLIC_FIELDS);

  res.status(201).json({ message: 'Group created successfully', group });
});

/**
 * Get group by ID
 * GET /api/groups/:id
 */
export const getGroup = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = (req as AuthRequest).user?.id;

  const group = await Group.findById(id)
    .populate('owner', USER_PUBLIC_FIELDS)
    .populate('members.user', USER_PUBLIC_FIELDS);

  if (!group) {
    throw new AppError('Group not found', 404);
  }

  // Check visibility
  const isMember = userId && getMemberRole(group, userId);
  if (group.visibility === GroupVisibility.PRIVATE && !isMember) {
    throw new AppError('Group not found', 404);
  }

  res.json({ group });
});

/**
 * Update group settings
 * PATCH /api/groups/:id
 */
export const updateGroup = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = (req as AuthRequest).user?.id;
  const input = req.body as UpdateGroupInput;

  if (!userId) {
    throw new AppError('Unauthorized', 401);
  }

  const group = await Group.findById(id);
  if (!group) {
    throw new AppError('Group not found', 404);
  }

  // Only Admin can update
  if (!hasRole(group, userId, GroupRole.ADMIN)) {
    throw new AppError('Only admins can update group settings', 403);
  }

  Object.assign(group, input);
  await group.save();

  await group.populate('owner', USER_PUBLIC_FIELDS);
  await group.populate('members.user', USER_PUBLIC_FIELDS);

  res.json({ message: 'Group updated successfully', group });
});

/**
 * Delete group
 * DELETE /api/groups/:id
 */
export const deleteGroup = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = (req as AuthRequest).user?.id;

  if (!userId) {
    throw new AppError('Unauthorized', 401);
  }

  const group = await Group.findById(id);
  if (!group) {
    throw new AppError('Group not found', 404);
  }

  // Only owner can delete
  if (!isOwner(group, userId)) {
    throw new AppError('Only the group owner can delete the group', 403);
  }

  // Delete all group events
  await Event.deleteMany({ group: id });

  // Delete the group
  await Group.findByIdAndDelete(id);

  res.json({ message: 'Group deleted successfully' });
});

/**
 * Transfer group ownership to another admin
 * POST /api/groups/:id/transfer
 */
export const transferOwnership = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = (req as AuthRequest).user?.id;
  const { newOwnerId } = req.body as TransferOwnershipInput;

  if (!userId) {
    throw new AppError('Unauthorized', 401);
  }

  const group = await Group.findById(id);
  if (!group) {
    throw new AppError('Group not found', 404);
  }

  // Only owner can transfer
  if (!isOwner(group, userId)) {
    throw new AppError('Only the group owner can transfer ownership', 403);
  }

  // New owner must be an admin
  const newOwnerMember = group.members.find((m) => m.user.toString() === newOwnerId);
  if (!newOwnerMember || newOwnerMember.role !== GroupRole.ADMIN) {
    throw new AppError('New owner must be an existing admin', 400);
  }

  // Transfer ownership
  group.owner = newOwnerId as unknown as IGroupDocument['owner'];

  // Update payment settings to new owner's Stripe account
  const newOwner = await User.findById(newOwnerId);
  if (newOwner?.stripeAccountId) {
    if (!group.paymentSettings) {
      group.paymentSettings = {};
    }
    group.paymentSettings.stripeAccountId = newOwner.stripeAccountId;
  }

  await group.save();

  await group.populate('owner', USER_PUBLIC_FIELDS);
  await group.populate('members.user', USER_PUBLIC_FIELDS);

  res.json({ message: 'Ownership transferred successfully', group });
});

/**
 * List groups the user is a member of
 * GET /api/groups/mine
 */
export const listMyGroups = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as AuthRequest).user?.id;

  if (!userId) {
    throw new AppError('Unauthorized', 401);
  }

  const groups = await Group.find({ 'members.user': userId })
    .populate('owner', USER_PUBLIC_FIELDS)
    .populate('members.user', USER_PUBLIC_FIELDS)
    .sort({ updatedAt: -1 });

  res.json({ groups });
});

/**
 * List public groups
 * GET /api/groups/public
 */
export const listPublicGroups = asyncHandler(async (req: Request, res: Response) => {
  const { search, limit = String(GROUP_DEFAULTS.PAGE_LIMIT), offset = '0' } = req.query;

  const query: Record<string, unknown> = {
    visibility: GroupVisibility.PUBLIC,
  };

  if (search && typeof search === 'string') {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  const groups = await Group.find(query)
    .populate('owner', USER_PUBLIC_FIELDS)
    .select('-membershipRequests -inviteCode')
    .sort({ createdAt: -1 })
    .limit(parseInt(limit as string, 10))
    .skip(parseInt(offset as string, 10));

  const total = await Group.countDocuments(query);

  res.json({ groups, total });
});

/**
 * Join a group (open policy or invite code)
 * POST /api/groups/:id/join
 */
export const joinGroup = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = (req as AuthRequest).user?.id;
  const { inviteCode } = req.body as JoinGroupInput;

  if (!userId) {
    throw new AppError('Unauthorized', 401);
  }

  const group = await Group.findById(id);
  if (!group) {
    throw new AppError('Group not found', 404);
  }

  // Check if already a member
  if (getMemberRole(group, userId)) {
    throw new AppError('You are already a member of this group', 400);
  }

  // Check join policy
  if (group.joinPolicy === GroupJoinPolicy.INVITE_ONLY) {
    if (!inviteCode || inviteCode !== group.inviteCode) {
      throw new AppError('Invalid invite code', 403);
    }
  } else if (group.joinPolicy === GroupJoinPolicy.REQUEST) {
    throw new AppError('This group requires approval to join. Use the request endpoint.', 400);
  }
  // OPEN policy allows joining

  // Add member
  group.members.push({
    user: userId as unknown as string,
    role: GroupRole.MEMBER,
    joinedAt: new Date(),
  });

  await group.save();

  await group.populate('owner', USER_PUBLIC_FIELDS);
  await group.populate('members.user', USER_PUBLIC_FIELDS);

  res.json({ message: 'Joined group successfully', group });
});

/**
 * Request to join a group
 * POST /api/groups/:id/request
 */
export const requestToJoin = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = (req as AuthRequest).user?.id;

  if (!userId) {
    throw new AppError('Unauthorized', 401);
  }

  const group = await Group.findById(id);
  if (!group) {
    throw new AppError('Group not found', 404);
  }

  // Check if already a member
  if (getMemberRole(group, userId)) {
    throw new AppError('You are already a member of this group', 400);
  }

  // Check if already has a pending request
  const existingRequest = group.membershipRequests.find(
    (r) => r.user.toString() === userId && r.status === MembershipRequestStatus.PENDING,
  );
  if (existingRequest) {
    throw new AppError('You already have a pending request', 400);
  }

  // Check if group allows requests
  if (group.joinPolicy !== GroupJoinPolicy.REQUEST) {
    throw new AppError('This group does not accept join requests', 400);
  }

  group.membershipRequests.push({
    user: userId as unknown as string,
    status: MembershipRequestStatus.PENDING,
    requestedAt: new Date(),
  });

  await group.save();

  res.json({ message: 'Join request submitted' });
});

/**
 * Handle a membership request (approve/reject)
 * POST /api/groups/:id/requests/:userId
 */
export const handleMembershipRequest = asyncHandler(async (req: Request, res: Response) => {
  const { id, userId: targetUserId } = req.params;
  const userId = (req as AuthRequest).user?.id;
  const { action } = req.body as HandleMembershipRequestInput;

  if (!userId) {
    throw new AppError('Unauthorized', 401);
  }

  const group = await Group.findById(id);
  if (!group) {
    throw new AppError('Group not found', 404);
  }

  // Admin or Moderator can handle requests
  if (!hasRole(group, userId, GroupRole.MODERATOR)) {
    throw new AppError('Only admins and moderators can handle membership requests', 403);
  }

  const requestIndex = group.membershipRequests.findIndex(
    (r) => r.user.toString() === targetUserId && r.status === MembershipRequestStatus.PENDING,
  );

  if (requestIndex === -1) {
    throw new AppError('No pending request found for this user', 404);
  }

  if (action === 'APPROVE') {
    // Add as member
    group.members.push({
      user: targetUserId as unknown as string,
      role: GroupRole.MEMBER,
      joinedAt: new Date(),
    });

    group.membershipRequests[requestIndex].status = MembershipRequestStatus.APPROVED;
  } else {
    group.membershipRequests[requestIndex].status = MembershipRequestStatus.REJECTED;
  }

  group.membershipRequests[requestIndex].reviewedBy = userId as unknown as string;
  group.membershipRequests[requestIndex].reviewedAt = new Date();

  await group.save();

  await group.populate('owner', USER_PUBLIC_FIELDS);
  await group.populate('members.user', USER_PUBLIC_FIELDS);

  res.json({
    message: `Request ${action === 'APPROVE' ? 'approved' : 'rejected'}`,
    group,
  });
});

/**
 * Remove a member from the group
 * DELETE /api/groups/:id/members/:userId
 */
export const removeMember = asyncHandler(async (req: Request, res: Response) => {
  const { id, userId: targetUserId } = req.params;
  const userId = (req as AuthRequest).user?.id;

  if (!userId) {
    throw new AppError('Unauthorized', 401);
  }

  const group = await Group.findById(id);
  if (!group) {
    throw new AppError('Group not found', 404);
  }

  // Admin or Moderator can remove members
  if (!hasRole(group, userId, GroupRole.MODERATOR)) {
    throw new AppError('Only admins and moderators can remove members', 403);
  }

  // Check if can modify this member
  if (!canModifyMember(group, userId, targetUserId)) {
    throw new AppError('You cannot remove this member', 403);
  }

  group.members = group.members.filter((m) => m.user.toString() !== targetUserId);
  await group.save();

  await group.populate('owner', USER_PUBLIC_FIELDS);
  await group.populate('members.user', USER_PUBLIC_FIELDS);

  res.json({ message: 'Member removed', group });
});

/**
 * Update a member's role
 * PATCH /api/groups/:id/members/:userId/role
 */
export const updateMemberRole = asyncHandler(async (req: Request, res: Response) => {
  const { id, userId: targetUserId } = req.params;
  const userId = (req as AuthRequest).user?.id;
  const { role } = req.body as UpdateMemberRoleInput;

  if (!userId) {
    throw new AppError('Unauthorized', 401);
  }

  const group = await Group.findById(id);
  if (!group) {
    throw new AppError('Group not found', 404);
  }

  // Only Admin can change roles
  if (!hasRole(group, userId, GroupRole.ADMIN)) {
    throw new AppError('Only admins can change member roles', 403);
  }

  // Can't change owner's role
  if (isOwner(group, targetUserId)) {
    throw new AppError("Cannot change the owner's role", 403);
  }

  const member = group.members.find((m) => m.user.toString() === targetUserId);
  if (!member) {
    throw new AppError('Member not found', 404);
  }

  member.role = role;
  await group.save();

  await group.populate('owner', USER_PUBLIC_FIELDS);
  await group.populate('members.user', USER_PUBLIC_FIELDS);

  res.json({ message: 'Member role updated', group });
});

/**
 * Leave a group
 * POST /api/groups/:id/leave
 */
export const leaveGroup = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = (req as AuthRequest).user?.id;

  if (!userId) {
    throw new AppError('Unauthorized', 401);
  }

  const group = await Group.findById(id);
  if (!group) {
    throw new AppError('Group not found', 404);
  }

  // Owner cannot leave without transferring
  if (isOwner(group, userId)) {
    throw new AppError('Owner must transfer ownership before leaving', 400);
  }

  // Check if member
  if (!getMemberRole(group, userId)) {
    throw new AppError('You are not a member of this group', 400);
  }

  group.members = group.members.filter((m) => m.user.toString() !== userId);
  await group.save();

  res.json({ message: 'Left group successfully' });
});

/**
 * Regenerate invite code
 * POST /api/groups/:id/invite-code
 */
export const regenerateInviteCode = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = (req as AuthRequest).user?.id;

  if (!userId) {
    throw new AppError('Unauthorized', 401);
  }

  const group = await Group.findById(id);
  if (!group) {
    throw new AppError('Group not found', 404);
  }

  // Only Admin can regenerate
  if (!hasRole(group, userId, GroupRole.ADMIN)) {
    throw new AppError('Only admins can regenerate the invite code', 403);
  }

  group.inviteCode = generateInviteCode();
  await group.save();

  res.json({ message: 'Invite code regenerated', inviteCode: group.inviteCode });
});

/**
 * Get events for a group
 * GET /api/groups/:id/events
 */
export const getGroupEvents = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = (req as AuthRequest).user?.id;

  const group = await Group.findById(id);
  if (!group) {
    throw new AppError('Group not found', 404);
  }

  const isMember = userId && getMemberRole(group, userId);

  // Private group - only members can see events
  if (group.visibility === GroupVisibility.PRIVATE && !isMember) {
    throw new AppError('Group not found', 404);
  }

  // Build query
  const query: Record<string, unknown> = { group: id };

  // Non-members only see public events
  if (!isMember) {
    query.isPublic = true;
  }

  const events = await Event.find(query)
    .populate('organizer', USER_PUBLIC_FIELDS)
    .populate('attendees.user', USER_PUBLIC_FIELDS)
    .sort({ date: 1 });

  res.json({ events });
});
