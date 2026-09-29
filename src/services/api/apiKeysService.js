import { apiRequest } from './apiClient.js';

/**
 * @typedef {Object} ApiKeySummary
 * @property {string} id
 * @property {string} tenantId
 * @property {string} name
 * @property {string} prefix
 * @property {string} keyType STANDARD | INTEGRATION
 * @property {string[]} scopes
 * @property {string} status ACTIVE | REVOKED | EXPIRED
 * @property {string|null} expiresAt
 * @property {string|null} lastUsedAt
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * @typedef {Object} ApiKeyCreateResult
 * @property {string} id
 * @property {string} name
 * @property {string} prefix
 * @property {string} secret
 * @property {string[]} scopes
 * @property {string} keyType
 * @property {string|null} expiresAt
 */

/**
 * @typedef {Object} ApiKeyRotateResult
 * @property {string} id
 * @property {string} prefix
 * @property {string} secret
 * @property {string} rotatedFromId
 */

export const apiKeysService = {
  /** GET /api/v1/api-keys */
  listApiKeys() {
    return apiRequest({ method: 'GET', url: '/api-keys' });
  },

  /** POST /api/v1/api-keys — secret returned once */
  createApiKey(body) {
    return apiRequest({ method: 'POST', url: '/api-keys', data: body });
  },

  /** POST /api/v1/api-keys/:apiKeyId/rotate — secret returned once; session required */
  rotateApiKey(apiKeyId) {
    return apiRequest({ method: 'POST', url: `/api-keys/${apiKeyId}/rotate` });
  },

  /** POST /api/v1/api-keys/:apiKeyId/revoke */
  revokeApiKey(apiKeyId) {
    return apiRequest({ method: 'POST', url: `/api-keys/${apiKeyId}/revoke` });
  },
};
