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
      return apiRequest('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
    },
    onSuccess: () => {
      // After successful registration, refetch the current user
      queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
    },
  });

  // Login a user
  const loginMutation = useMutation({
    mutationFn: async (credentials: UserLogin) => {
      return apiRequest('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
    },
    onSuccess: () => {
      // After successful login, refetch the current user
      queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
    },
  });

  // Logout the current user
  const logoutMutation = useMutation({
    mutationFn: async () => {
      return apiRequest('/api/auth/logout', {
        method: 'POST',
      });
    },
    onSuccess: () => {
      // After successful logout, refetch the current user (will return 401)
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





































































