/**
 * @param {import('../constants/navigationConfig.js').NavItem[]} items
 * @param {{ isRbacAvailable: boolean, permissions: string[] }} authz
 */
export function filterNavigationItems(items, authz) {
  return items.filter((item) => {
    if (item.futureModule) {
      return false;
    }
    if (!item.permissionKey) {
      return true;
    }
    if (!authz.isRbacAvailable) {
      return true;
    }
    return authz.permissions.includes(item.permissionKey);
  });
}
