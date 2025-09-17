import { useQuery } from '@tanstack/react-query';

interface User {
  id: string;
  role: string;
  email?: string;
  name?: string;
}

/**
 * Hook to get current user information including role
 */
export function useUserRole() {
  const { data: user, isLoading } = useQuery<User>({
    queryKey: ['/api/auth/me'],
    queryFn: async () => {
      const response = await fetch('/api/auth/me', {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Not authenticated');
      }
      
      return response.json();
    },
    retry: false,
  });

  const isAdmin = user?.role === 'ADMIN' || user?.role === 'PRESIDENT';
  const isMember = user?.role === 'MEMBER' || user?.role === 'AGENT' || isAdmin;
  
  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    isAdmin,
    isMember,
    role: user?.role,
  };
}