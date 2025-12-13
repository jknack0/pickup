import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/client';
import type { RegisterInput, LoginInput } from '@pickup/shared';

// API Functions
const getMe = async () => {
  try {
    const { data } = await api.get('/auth/me');
    return data;
  } catch {
    return null;
  }
};

const login = async (credentials: LoginInput) => {
  const { data } = await api.post('/auth/login', credentials);
  return data;
};

const register = async (credentials: RegisterInput) => {
  const { data } = await api.post('/auth/register', credentials);
  return data;
};

const logout = async () => {
  await api.post('/auth/logout');
};

// Hooks
export const useUser = () => {
  return useQuery({
    queryKey: ['me'],
    queryFn: getMe,
    retry: 0,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      queryClient.setQueryData(['me'], data.user);
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: register,
    onSuccess: (data) => {
      queryClient.setQueryData(['me'], data.user);
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.setQueryData(['me'], null);
      queryClient.invalidateQueries({ queryKey: ['me'] });
    },
  });
};
