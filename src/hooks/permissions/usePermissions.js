/**
 * Permission checks for navigation/actions.
 * GAP-1: `/auth/me` does not expose permissions — do not assume RBAC.
 */

export function usePermissions() {
  return {
    /**
     * @param {string} _permissionKey
     * @returns {boolean}
     */
    can(_permissionKey) {
      void _permissionKey;
      return true;
    },
    isRbacAvailable: false,
  };
}
