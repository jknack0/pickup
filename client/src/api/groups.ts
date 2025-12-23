import type { AxiosResponse } from 'axios';
import api from './client';
import type {
  IGroup,
  IEvent,
  CreateGroupInput,
  UpdateGroupInput,
  HandleMembershipRequestInput,
  TransferOwnershipInput,
  UpdateMemberRoleInput,
  JoinGroupInput,
} from '@pickup/shared';

// API Response Types
interface GroupResponse {
  group: IGroup;
  message?: string;
}

interface GroupsResponse {
  groups: IGroup[];
  total?: number;
}

interface EventsResponse {
  events: IEvent[];
}

interface MessageResponse {
  message: string;
}

interface InviteCodeResponse {
  message: string;
  inviteCode: string;
}

// ============================================================================
// GROUP CRUD
// ============================================================================

export const createGroup = (data: CreateGroupInput): Promise<AxiosResponse<GroupResponse>> =>
  api.post('/groups', data);

export const getGroup = (id: string): Promise<AxiosResponse<GroupResponse>> =>
  api.get(`/groups/${id}`);

export const updateGroup = (
  id: string,
  data: UpdateGroupInput,
): Promise<AxiosResponse<GroupResponse>> => api.patch(`/groups/${id}`, data);

export const deleteGroup = (id: string): Promise<AxiosResponse<MessageResponse>> =>
  api.delete(`/groups/${id}`);

// ============================================================================
// GROUP LISTING
// ============================================================================

export const getMyGroups = (): Promise<AxiosResponse<GroupsResponse>> => api.get('/groups/mine');

export const getPublicGroups = (params?: {
  search?: string;
  limit?: number;
  offset?: number;
}): Promise<AxiosResponse<GroupsResponse>> => api.get('/groups/public', { params });

export const getGroupEvents = (groupId: string): Promise<AxiosResponse<EventsResponse>> =>
  api.get(`/groups/${groupId}/events`);

// ============================================================================
// MEMBERSHIP
// ============================================================================

export const joinGroup = (
  id: string,
  data?: JoinGroupInput,
): Promise<AxiosResponse<GroupResponse>> => api.post(`/groups/${id}/join`, data || {});

export const requestToJoin = (id: string): Promise<AxiosResponse<MessageResponse>> =>
  api.post(`/groups/${id}/request`);

export const leaveGroup = (id: string): Promise<AxiosResponse<MessageResponse>> =>
  api.post(`/groups/${id}/leave`);

export const handleMembershipRequest = (
  groupId: string,
  userId: string,
  data: HandleMembershipRequestInput,
): Promise<AxiosResponse<GroupResponse>> => api.post(`/groups/${groupId}/requests/${userId}`, data);

// ============================================================================
// MEMBER MANAGEMENT
// ============================================================================

export const removeMember = (
  groupId: string,
  userId: string,
): Promise<AxiosResponse<GroupResponse>> => api.delete(`/groups/${groupId}/members/${userId}`);

export const updateMemberRole = (
  groupId: string,
  userId: string,
  data: UpdateMemberRoleInput,
): Promise<AxiosResponse<GroupResponse>> =>
  api.patch(`/groups/${groupId}/members/${userId}/role`, data);

// ============================================================================
// ADMIN ACTIONS
// ============================================================================

export const transferOwnership = (
  id: string,
  data: TransferOwnershipInput,
): Promise<AxiosResponse<GroupResponse>> => api.post(`/groups/${id}/transfer`, data);

export const regenerateInviteCode = (id: string): Promise<AxiosResponse<InviteCodeResponse>> =>
  api.post(`/groups/${id}/invite-code`);
