import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { User, UserRegistration, UserLogin } from '@shared/schema';
import { apiRequest } from '@/lib/queryClient';

export function useAuth() {
  const queryClient = useQueryClient();

  // Get the current user
  const { data: user, isLoading, error } = useQuery<User>({
    queryKey: ['/api/auth/me'],
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Register a new user
  const registerMutation = useMutation({
    mutationFn: async (userData: UserRegistration) => {
      const response = await apiRequest('POST', '/api/auth/register', userData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
    },
  });

  // Login a user
  const loginMutation = useMutation({
    mutationFn: async (credentials: UserLogin) => {
      const response = await apiRequest('POST', '/api/auth/login', credentials);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
    },
  });

  // Logout the current user
  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/auth/logout');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
    },
  });

  return {
    user,
    isLoading,
    error,
    isAuthenticated: !!user,
    register: registerMutation.mutate,
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
    registerStatus: {
      isLoading: registerMutation.isPending,
      error: registerMutation.error,
    },
    loginStatus: {
      isLoading: loginMutation.isPending,
      error: loginMutation.error,
    },
    logoutStatus: {
      isLoading: logoutMutation.isPending,
      error: logoutMutation.error,
    },
  };
}





































































