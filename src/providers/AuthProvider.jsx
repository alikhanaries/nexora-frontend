import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/authContext.js';
import { authQueryKeys } from '../constants/authQueryKeys.js';
import { authService } from '../services/auth/authService.js';
import { getRefreshToken, hasStoredSession } from '../services/auth/authSession.js';
import { setSessionExpiredHandler } from '../services/auth/sessionExpired.js';
import { normalizeAuthPrincipal } from '../utils/normalizeAuthPrincipal.js';

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [status, setStatus] = useState(
    /** @type {'bootstrapping' | 'authenticated' | 'anonymous'} */ (
      hasStoredSession() ? 'bootstrapping' : 'anonymous'
    ),
  );
  const [user, setUser] = useState(/** @type {import('../services/auth/authService.js').MePayload | null} */ (null));
  const [permissions, setPermissions] = useState(/** @type {string[]} */ ([]));
  const [roles, setRoles] = useState(/** @type {string[]} */ ([]));
  const [membershipId, setMembershipId] = useState(/** @type {string | null} */ (null));
  const [isRbacAvailable, setIsRbacAvailable] = useState(false);

  const applyPrincipal = useCallback(
    (me) => {
      const principal = normalizeAuthPrincipal(me);
      setUser(principal.user);
      setPermissions(principal.permissions);
      setRoles(principal.roles);
      setMembershipId(principal.membershipId);
      setIsRbacAvailable(principal.isRbacAvailable);
      queryClient.setQueryData(authQueryKeys.me(), principal);
    },
    [queryClient],
  );

  const resetAuthState = useCallback(() => {
    setUser(null);
    setPermissions([]);
    setRoles([]);
    setMembershipId(null);
    setIsRbacAvailable(false);
    setStatus('anonymous');
    queryClient.removeQueries({ queryKey: authQueryKeys.all });
    queryClient.clear();
  }, [queryClient]);

  const bootstrapSession = useCallback(async () => {
    if (!hasStoredSession()) {
      resetAuthState();
      return;
    }

    setStatus('bootstrapping');
    try {
      const me = await authService.getCurrentUser();
      applyPrincipal(me);
      setStatus('authenticated');
    } catch {
      authService.clearLocalSession();
      resetAuthState();
    }
  }, [applyPrincipal, resetAuthState]);

  useEffect(() => {
    bootstrapSession();
  }, [bootstrapSession]);

  useEffect(() => {
    setSessionExpiredHandler(() => {
      resetAuthState();
      navigate('/login', { replace: true });
    });
    return () => setSessionExpiredHandler(null);
  }, [navigate, resetAuthState]);

  const login = useCallback(
    async (input) => {
      await authService.login(input);
      const me = await authService.getCurrentUser();
      applyPrincipal(me);
      setStatus('authenticated');
    },
    [applyPrincipal],
  );

  const logout = useCallback(async () => {
    const refreshToken = getRefreshToken();
    try {
      if (refreshToken) {
        await authService.logout(refreshToken);
      } else {
        authService.clearLocalSession();
      }
    } catch {
      authService.clearLocalSession();
    } finally {
      resetAuthState();
      navigate('/login', { replace: true });
    }
  }, [navigate, resetAuthState]);

  const value = useMemo(
    () => ({
      status,
      isLoading: status === 'bootstrapping',
      isAuthenticated: status === 'authenticated',
      user,
      permissions,
      roles,
      membershipId,
      isRbacAvailable,
      login,
      logout,
    }),
    [status, user, permissions, roles, membershipId, isRbacAvailable, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
