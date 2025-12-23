import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getMyGroups,
  getPublicGroups,
  getGroup,
  getGroupEvents,
  createGroup,
  updateGroup,
  deleteGroup,
  joinGroup,
  leaveGroup,
  requestToJoin,
  handleMembershipRequest,
  removeMember,
  updateMemberRole,
  transferOwnership,
  regenerateInviteCode,
} from '@/api/groups';
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
import { queryKeys } from '@/lib/queryKeys';

// ============================================================================
// QUERIES
// ============================================================================

export const useMyGroups = () => {
  return useQuery({
    queryKey: queryKeys.groups.mine(),
    queryFn: async () => {
      const { data } = await getMyGroups();
      return data.groups as IGroup[];
    },
  });
};

export const usePublicGroups = (params?: { search?: string; limit?: number; offset?: number }) => {
  return useQuery({
    queryKey: queryKeys.groups.public(params),
    queryFn: async () => {
      const { data } = await getPublicGroups(params);
      return { groups: data.groups as IGroup[], total: data.total || 0 };
    },
  });
};

export const useGroup = (id: string) => {
  return useQuery({
    queryKey: queryKeys.groups.detail(id),
    queryFn: async () => {
      const { data } = await getGroup(id);
      return data.group as IGroup;
    },
    enabled: !!id,
  });
};

export const useGroupEvents = (groupId: string) => {
  return useQuery({
    queryKey: queryKeys.groups.events(groupId),
    queryFn: async () => {
      const { data } = await getGroupEvents(groupId);
      return data.events as IEvent[];
    },
    enabled: !!groupId,
  });
};

// ============================================================================
// MUTATIONS
// ============================================================================

export const useCreateGroup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateGroupInput) => createGroup(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.groups.mine() });
    },
  });
};

export const useUpdateGroup = (groupId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateGroupInput) => updateGroup(groupId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.groups.detail(groupId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.groups.mine() });
    },
  });
};

export const useDeleteGroup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (groupId: string) => deleteGroup(groupId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.groups.all });
    },
  });
};

export const useJoinGroup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ groupId, data }: { groupId: string; data?: JoinGroupInput }) =>
      joinGroup(groupId, data),
    onSuccess: (_, { groupId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.groups.detail(groupId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.groups.mine() });
    },
  });
};

export const useLeaveGroup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (groupId: string) => leaveGroup(groupId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.groups.all });
    },
  });
};

export const useRequestToJoin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (groupId: string) => requestToJoin(groupId),
    onSuccess: (_, groupId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.groups.detail(groupId) });
    },
  });
};

export const useHandleMembershipRequest = (groupId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: HandleMembershipRequestInput }) =>
      handleMembershipRequest(groupId, userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.groups.detail(groupId) });
    },
  });
};

export const useRemoveMember = (groupId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => removeMember(groupId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.groups.detail(groupId) });
    },
  });
};

export const useUpdateMemberRole = (groupId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: UpdateMemberRoleInput }) =>
      updateMemberRole(groupId, userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.groups.detail(groupId) });
    },
  });
};

export const useTransferOwnership = (groupId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: TransferOwnershipInput) => transferOwnership(groupId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.groups.detail(groupId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.groups.mine() });
    },
  });
};

export const useRegenerateInviteCode = (groupId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => regenerateInviteCode(groupId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.groups.detail(groupId) });
    },
  });
};
