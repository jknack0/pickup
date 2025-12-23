import { z } from 'zod';
import { EventType } from './event.js';
import { GROUP_CONSTRAINTS } from '../constants/group.js';

// ============================================================================
// ENUMS
// ============================================================================

export enum GroupRole {
    ADMIN = 'ADMIN',
    MODERATOR = 'MODERATOR',
    MEMBER = 'MEMBER',
}

export enum GroupVisibility {
    PUBLIC = 'PUBLIC',
    PRIVATE = 'PRIVATE',
}

export enum GroupJoinPolicy {
    OPEN = 'OPEN', // Anyone can join
    REQUEST = 'REQUEST', // Request approval from admin/mod
    INVITE_ONLY = 'INVITE_ONLY', // Only via invite link
}

export enum MembershipRequestStatus {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
}

// ============================================================================
// INTERFACES
// ============================================================================

export interface IGroupMember {
    user: string; // User ID
    role: GroupRole;
    joinedAt: Date | string;
}

export interface IMembershipRequest {
    user: string; // User ID
    status: MembershipRequestStatus;
    requestedAt: Date | string;
    reviewedBy?: string; // User ID who reviewed this request
    reviewedAt?: Date | string;
}

export interface IGroupPaymentSettings {
    defaultPrice?: number; // in cents
    defaultCurrency?: string;
    stripeAccountId?: string; // Inherited from group owner's Stripe account
}

export interface IGroup {
    _id: string;
    name: string;
    description?: string;
    avatarUrl?: string;
    owner: string; // User ID (current owner, always Admin, can be transferred)
    members: IGroupMember[];
    membershipRequests: IMembershipRequest[];
    visibility: GroupVisibility;
    joinPolicy: GroupJoinPolicy;
    inviteCode?: string; // Unique code for invite links
    defaultSportTypes: EventType[];
    location?: string;
    coordinates?: {
        lat: number;
        lng: number;
    };
    paymentSettings?: IGroupPaymentSettings;
    createdAt: Date | string;
    updatedAt: Date | string;
}

// Populated version for API responses
export interface IGroupPopulated extends Omit<IGroup, 'owner' | 'members'> {
    owner: {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
    };
    members: Array<{
        user: {
            _id: string;
            firstName: string;
            lastName: string;
            email: string;
        };
        role: GroupRole;
        joinedAt: Date | string;
    }>;
}

// ============================================================================
// ZOD SCHEMAS
// ============================================================================

export const CreateGroupSchema = z.object({
    name: z
        .string()
        .min(GROUP_CONSTRAINTS.NAME_MIN_LENGTH, 'Group name is required')
        .max(GROUP_CONSTRAINTS.NAME_MAX_LENGTH, `Group name must be at most ${GROUP_CONSTRAINTS.NAME_MAX_LENGTH} characters`),
    description: z
        .string()
        .max(GROUP_CONSTRAINTS.DESC_MAX_LENGTH, `Description must be at most ${GROUP_CONSTRAINTS.DESC_MAX_LENGTH} characters`)
        .optional(),
    visibility: z.nativeEnum(GroupVisibility).default(GroupVisibility.PUBLIC),
    joinPolicy: z.nativeEnum(GroupJoinPolicy).default(GroupJoinPolicy.OPEN),
    defaultSportTypes: z.array(z.nativeEnum(EventType)).default([]),
    location: z.string().optional(),
    coordinates: z
        .object({
            lat: z.number(),
            lng: z.number(),
        })
        .optional(),
});

export type CreateGroupInput = z.infer<typeof CreateGroupSchema>;

export const UpdateGroupSchema = z.object({
    name: z
        .string()
        .min(GROUP_CONSTRAINTS.NAME_MIN_LENGTH, 'Group name is required')
        .max(GROUP_CONSTRAINTS.NAME_MAX_LENGTH, `Group name must be at most ${GROUP_CONSTRAINTS.NAME_MAX_LENGTH} characters`)
        .optional(),
    description: z
        .string()
        .max(GROUP_CONSTRAINTS.DESC_MAX_LENGTH, `Description must be at most ${GROUP_CONSTRAINTS.DESC_MAX_LENGTH} characters`)
        .optional(),
    avatarUrl: z.string().url('Invalid avatar URL').optional().or(z.literal('')),
    visibility: z.nativeEnum(GroupVisibility).optional(),
    joinPolicy: z.nativeEnum(GroupJoinPolicy).optional(),
    defaultSportTypes: z.array(z.nativeEnum(EventType)).optional(),
    location: z.string().optional(),
    coordinates: z
        .object({
            lat: z.number(),
            lng: z.number(),
        })
        .optional(),
});

export type UpdateGroupInput = z.infer<typeof UpdateGroupSchema>;

export const HandleMembershipRequestSchema = z.object({
    action: z.enum(['APPROVE', 'REJECT']),
});

export type HandleMembershipRequestInput = z.infer<typeof HandleMembershipRequestSchema>;

export const TransferOwnershipSchema = z.object({
    newOwnerId: z.string().min(1, 'New owner ID is required'),
});

export type TransferOwnershipInput = z.infer<typeof TransferOwnershipSchema>;

export const UpdateMemberRoleSchema = z.object({
    role: z.nativeEnum(GroupRole),
});

export type UpdateMemberRoleInput = z.infer<typeof UpdateMemberRoleSchema>;

// Schema for joining a group with invite code
export const JoinGroupSchema = z.object({
    inviteCode: z.string().optional(),
});

export type JoinGroupInput = z.infer<typeof JoinGroupSchema>;
