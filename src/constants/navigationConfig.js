/**
 * Central navigation config — permission keys reserved for future RBAC (GAP-1).
 * Do not enforce permissions until `/auth/me` exposes them.
 */

/** @typedef {{ id: string, label: string, path: string, section?: string, permissionKey?: string, futureModule: boolean }} NavItem */

/** @type {NavItem[]} */
export const navigationConfig = [
  { id: 'overview', label: 'Overview', path: '/', section: 'Main', futureModule: true },
  { id: 'products', label: 'Products', path: '/products', section: 'Catalog', futureModule: false },
  { id: 'inventory', label: 'Inventory', path: '/inventory', section: 'Catalog', futureModule: false },
  { id: 'pricing', label: 'Pricing', path: '/pricing', section: 'Catalog', futureModule: false },
  { id: 'offers', label: 'Offers', path: '/offers', section: 'Catalog', futureModule: false },
  { id: 'orders', label: 'Orders', path: '/orders', section: 'Operations', futureModule: false },
  { id: 'shipments', label: 'Shipments', path: '/shipments', section: 'Operations', futureModule: false },
  { id: 'returns', label: 'Returns', path: '/returns', section: 'Operations', futureModule: true },
  { id: 'channels', label: 'Channels', path: '/channels', section: 'Integrations', futureModule: false },
  {
    id: 'integrations',
    label: 'Integrations',
    path: '/integrations',
    section: 'Integrations',
    futureModule: true,
  },
  {
    id: 'sync',
    label: 'Synchronization',
    path: '/synchronization',
    section: 'Integrations',
    futureModule: true,
  },
  { id: 'queue', label: 'Queue', path: '/queue', section: 'Integrations', futureModule: true },
  { id: 'audit', label: 'Audit logs', path: '/audit', section: 'Administration', futureModule: true },
  { id: 'settings', label: 'Settings', path: '/settings', section: 'Administration', futureModule: true },
];

/**
 * @param {string} pathname
 * @returns {NavItem | undefined}
 */
export function findNavItemByPath(pathname) {
  const normalized = pathname === '' ? '/' : pathname;
  return navigationConfig.find((item) => item.path === normalized);
}
