import { PERMISSIONS } from './permissions.js';

/**
 * Central navigation config.
 * `permissionKey` is enforced when GET /auth/me (or equivalent) exposes effective permissions.
 */

/** @typedef {{ id: string, label: string, path: string, section?: string, permissionKey?: string, futureModule: boolean }} NavItem */

/** @type {NavItem[]} */
export const navigationConfig = [
  { id: 'overview', label: 'Overview', path: '/', section: 'Main', futureModule: false },
  {
    id: 'products',
    label: 'Products',
    path: '/products',
    section: 'Catalog',
    permissionKey: PERMISSIONS.PRODUCTS_READ,
    futureModule: false,
  },
  {
    id: 'inventory',
    label: 'Inventory',
    path: '/inventory',
    section: 'Catalog',
    permissionKey: PERMISSIONS.INVENTORY_READ,
    futureModule: false,
  },
  {
    id: 'pricing',
    label: 'Pricing',
    path: '/pricing',
    section: 'Catalog',
    permissionKey: PERMISSIONS.PRICING_READ,
    futureModule: false,
  },
  {
    id: 'offers',
    label: 'Offers',
    path: '/offers',
    section: 'Catalog',
    permissionKey: PERMISSIONS.OFFERS_READ,
    futureModule: false,
  },
  {
    id: 'orders',
    label: 'Orders',
    path: '/orders',
    section: 'Operations',
    permissionKey: PERMISSIONS.ORDERS_READ,
    futureModule: false,
  },
  {
    id: 'shipments',
    label: 'Shipments',
    path: '/shipments',
    section: 'Operations',
    permissionKey: PERMISSIONS.SHIPMENTS_READ,
    futureModule: false,
  },
  {
    id: 'cancellations',
    label: 'Cancellations',
    path: '/cancellations',
    section: 'Operations',
    permissionKey: PERMISSIONS.CANCELLATIONS_READ,
    futureModule: false,
  },
  {
    id: 'returns',
    label: 'Returns',
    path: '/returns',
    section: 'Operations',
    permissionKey: PERMISSIONS.RETURNS_READ,
    futureModule: false,
  },
  {
    id: 'marketplaces',
    label: 'Marketplaces',
    path: '/marketplaces',
    section: 'Integrations',
    permissionKey: PERMISSIONS.MARKETPLACES_READ,
    futureModule: false,
  },
  {
    id: 'channels',
    label: 'Channels',
    path: '/channels',
    section: 'Integrations',
    permissionKey: PERMISSIONS.CHANNELS_READ,
    futureModule: false,
  },
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
  {
    id: 'roles',
    label: 'Roles',
    path: '/roles',
    section: 'Administration',
    permissionKey: PERMISSIONS.ROLES_READ,
    futureModule: false,
  },
  {
    id: 'api-keys',
    label: 'API keys',
    path: '/api-keys',
    section: 'Administration',
    permissionKey: PERMISSIONS.API_KEYS_READ,
    futureModule: false,
  },
  {
    id: 'webhooks',
    label: 'Webhooks',
    path: '/webhooks',
    section: 'Administration',
    permissionKey: PERMISSIONS.WEBHOOKS_READ,
    futureModule: false,
  },
  {
    id: 'audit',
    label: 'Audit logs',
    path: '/audit',
    section: 'Administration',
    permissionKey: PERMISSIONS.AUDIT_READ,
    futureModule: false,
  },
  {
    id: 'settings',
    label: 'Settings',
    path: '/settings',
    section: 'Administration',
    futureModule: false,
  },
  { id: 'settings', label: 'Settings', path: '/settings', section: 'Administration', futureModule: false },
];

/**
 * @param {string} pathname
 * @returns {NavItem | undefined}
 */
export function findNavItemByPath(pathname) {
  const normalized = pathname === '' ? '/' : pathname;
  const exact = navigationConfig.find((item) => item.path === normalized);
  if (exact) return exact;
  return navigationConfig.find(
    (item) => item.path !== '/' && normalized.startsWith(`${item.path}/`),
  );
}
