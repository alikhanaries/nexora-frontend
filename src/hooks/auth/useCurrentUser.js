import { useQuery } from '@tanstack/react-query';
import { authQueryKeys } from '../../constants/authQueryKeys.js';
import { authService } from '../../services/auth/authService.js';
import { normalizeAuthPrincipal } from '../../utils/normalizeAuthPrincipal.js';
import { useAuth } from '../useAuth.js';

/**
 * TanStack Query view of the authenticated principal (mirrors AuthProvider session user).
 */
export function useCurrentUser() {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: authQueryKeys.me(),
    queryFn: async () => {
      const me = await authService.getCurrentUser();
      return normalizeAuthPrincipal(me);
    },
    enabled: isAuthenticated,
    staleTime: 60_000,
  });
}
