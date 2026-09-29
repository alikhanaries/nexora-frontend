/**
 * Permission keys referenced by the frontend (must match backend requirePermission strings).
 * Not an exhaustive catalog — see GET /api/v1/permissions for the full list when authorized.
 */

export const PERMISSIONS = {
  AUDIT_READ: 'audit.read',
  API_KEYS_READ: 'api_keys.read',
  API_KEYS_MANAGE: 'api_keys.manage',
  WEBHOOKS_READ: 'webhooks.read',
  WEBHOOKS_MANAGE: 'webhooks.manage',
  CANCELLATIONS_READ: 'cancellations.read',
  CANCELLATIONS_CREATE: 'cancellations.create',
  ORDERS_READ: 'orders.read',
  ORDERS_UPDATE: 'orders.update',
  ORDERS_CANCEL: 'orders.cancel',
  CHANNELS_READ: 'channels.read',
  CHANNELS_UPDATE: 'channels.update',
  PRODUCTS_READ: 'products.read',
  INVENTORY_READ: 'inventory.read',
  PRICING_READ: 'pricing.read',
  OFFERS_READ: 'offers.read',
  SHIPMENTS_READ: 'shipments.read',
  RETURNS_READ: 'returns.read',
  MFA_MANAGE: 'mfa.manage',
};
