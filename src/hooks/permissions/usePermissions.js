import { useMemo } from 'react';
import { useAuth } from '../useAuth.js';
import {
  hasAllPermissions,
  hasAnyPermission,
  hasPermission,
} from '../../utils/normalizeAuthPrincipal.js';

export function usePermissions() {
  const { isLoading, permissions, roles, isRbacAvailable } = useAuth();

  return useMemo(
    () => ({
      permissions,
      roles,
      isRbacAvailable,
      isLoading,
      /**
       * UX authorization only — backend enforces real access.
       * Returns false while RBAC data is unavailable (backend GAP-18).
       * @param {string} permissionKey
       */
      can(permissionKey) {
        if (!isRbacAvailable) {
          return false;
        }
        return hasPermission(permissions, permissionKey);
      },
      /**
       * @param {string} roleName
       */
      hasRole(roleName) {
        if (!isRbacAvailable) {
          return false;
        }
        return roles.includes(roleName);
      },
      /** @param {string[]} permissionKeys */
      canAny(permissionKeys) {
        if (!isRbacAvailable) {
          return false;
        }
        return hasAnyPermission(permissions, permissionKeys);
      },
      /** @param {string[]} permissionKeys */
      canAll(permissionKeys) {
        if (!isRbacAvailable) {
          return false;
        }
        return hasAllPermissions(permissions, permissionKeys);
      },
    }),
    [permissions, roles, isRbacAvailable, isLoading],
  );
}
