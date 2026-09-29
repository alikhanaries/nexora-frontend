/**
 * Mirrors backend marketplace-connection schemas and adapter README credential shapes.
 * Marketplace keys: amazon, shopify, noon, namshi (backend register-marketplace-catalog-adapters.js).
 */

export const MARKETPLACE_CONNECTION_STATUS = {
  ACTIVE: 'ACTIVE',
  DISABLED: 'DISABLED',
};

export const MARKETPLACE_CONNECTION_TEST_OUTCOME = {
  SUCCESS: 'SUCCESS',
  FAILURE: 'FAILURE',
};

/** @typedef {'text' | 'password' | 'select'} MarketplaceConnectionFieldType */

/**
 * @typedef {Object} MarketplaceConnectionFieldDef
 * @property {string} name
 * @property {string} label
 * @property {MarketplaceConnectionFieldType} [type]
 * @property {boolean} [required]
 * @property {boolean} [secret]
 * @property {boolean} [multiline]
 * @property {string[]} [options]
 * @property {string} [helperText]
 * @property {string} [placeholder]
 */

/**
 * @typedef {Object} MarketplaceConnectionFieldSet
 * @property {MarketplaceConnectionFieldDef[]} credentials
 * @property {MarketplaceConnectionFieldDef[]} configuration
 */

/** @type {Record<string, MarketplaceConnectionFieldSet>} */
export const MARKETPLACE_CONNECTION_FIELDS_BY_KEY = {
  amazon: {
    credentials: [
      { name: 'clientId', label: 'LWA client ID', type: 'text', required: true },
      { name: 'clientSecret', label: 'LWA client secret', type: 'password', required: true, secret: true },
      { name: 'refreshToken', label: 'LWA refresh token', type: 'password', required: true, secret: true },
      { name: 'sellerId', label: 'Seller ID', type: 'text', required: true },
      { name: 'awsAccessKeyId', label: 'AWS access key ID', type: 'text', required: true },
      { name: 'awsSecretAccessKey', label: 'AWS secret access key', type: 'password', required: true, secret: true },
      {
        name: 'awsSessionToken',
        label: 'AWS session token (optional)',
        type: 'password',
        secret: true,
        helperText: 'Optional STS session token when using temporary credentials.',
      },
    ],
    configuration: [
      { name: 'marketplaceId', label: 'Amazon marketplace ID', type: 'text', required: true, placeholder: 'ATVPDKIKX0DER' },
      {
        name: 'region',
        label: 'SP-API region',
        type: 'select',
        options: ['na', 'eu', 'fe'],
        required: true,
        helperText: 'Endpoint group: na (default), eu, or fe.',
      },
      { name: 'awsRegion', label: 'AWS region override (optional)', type: 'text' },
      { name: 'listingsProductType', label: 'Listings product type (optional)', type: 'text', placeholder: 'PRODUCT' },
      { name: 'lwaTokenUrl', label: 'LWA token URL override (optional)', type: 'text' },
    ],
  },
  shopify: {
    credentials: [
      { name: 'shopDomain', label: 'Shop domain', type: 'text', required: true, placeholder: 'example.myshopify.com' },
      { name: 'accessToken', label: 'Admin API access token', type: 'password', required: true, secret: true },
    ],
    configuration: [
      { name: 'shopifyLocationId', label: 'Shopify location ID (optional)', type: 'text' },
      { name: 'apiVersion', label: 'Admin API version (optional)', type: 'text', placeholder: '2024-10' },
    ],
  },
  noon: {
    credentials: [
      { name: 'keyId', label: 'Service account key ID', type: 'text', required: true },
      {
        name: 'privateKey',
        label: 'Private key (PEM)',
        type: 'password',
        required: true,
        secret: true,
        multiline: true,
      },
      { name: 'projectCode', label: 'Default project code', type: 'text', required: true },
    ],
    configuration: [
      {
        name: 'countryCode',
        label: 'Country code',
        type: 'select',
        options: ['ae', 'sa', 'eg'],
        required: true,
      },
      { name: 'warehouseCode', label: 'Warehouse code', type: 'text', required: true },
      { name: 'apiBaseUrl', label: 'API base URL (optional)', type: 'text' },
      { name: 'userAgent', label: 'User-Agent (optional)', type: 'text' },
    ],
  },
  namshi: {
    credentials: [
      { name: 'keyId', label: 'Service account key ID', type: 'text', required: true },
      {
        name: 'privateKey',
        label: 'Private key (PEM)',
        type: 'password',
        required: true,
        secret: true,
        multiline: true,
      },
      { name: 'projectCode', label: 'Default project code', type: 'text', required: true },
    ],
    configuration: [
      {
        name: 'countryCode',
        label: 'Country code',
        type: 'select',
        options: ['ae', 'sa', 'eg'],
        required: true,
      },
      { name: 'warehouseCode', label: 'Warehouse code', type: 'text', required: true },
      { name: 'apiBaseUrl', label: 'API base URL (optional)', type: 'text' },
      { name: 'userAgent', label: 'User-Agent (optional)', type: 'text' },
    ],
  },
};

export function getMarketplaceConnectionFieldSet(marketplaceKey) {
  return MARKETPLACE_CONNECTION_FIELDS_BY_KEY[marketplaceKey] ?? null;
}
