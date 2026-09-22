import { useCallback, useMemo, useSyncExternalStore } from 'react';
import { subscribeAuthSession } from '../services/auth/authEvents.js';
import { getRefreshToken, hasStoredSession } from '../services/auth/authSession.js';
import { authService } from '../services/auth/authService.js';

/**
 * Auth session hook — full login UI comes in a later phase.
 */
export function useAuth() {
  const isAuthenticated = useSyncExternalStore(
    subscribeAuthSession,
    hasStoredSession,
    () => false,
  );

  const logout = useCallback(async () => {
    const refreshToken = getRefreshToken();
    if (refreshToken) {
      await authService.logout(refreshToken);
    } else {
      authService.clearLocalSession();
    }
  }, []);

  return useMemo(
    () => ({
      isAuthenticated,
      logout,
    }),
    [isAuthenticated, logout],
  );
}
