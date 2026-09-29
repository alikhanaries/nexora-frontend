/**
 * Whether a permission-gated action should render in the UI.
 * When RBAC data is unavailable (backend GAP-18), show actions so operators are not blocked;
 * the API still enforces authorization.
 *
 * @param {{ isRbacAvailable: boolean, can: (key: string) => boolean }} permissions
 * @param {string} permissionKey
 */
export function canShowPermissionAction(permissions, permissionKey) {
  if (!permissions.isRbacAvailable) {
    return true;
  }
  return permissions.can(permissionKey);
}
