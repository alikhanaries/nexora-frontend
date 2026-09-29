import { apiRequest } from './apiClient.js';

/**
 * @typedef {Object} MarketplaceConnection
 * @property {string} id
 * @property {string} tenantId
 * @property {string} channelId
 * @property {string} marketplaceKey
 * @property {Record<string, unknown>} configuration
 * @property {'ACTIVE'|'DISABLED'} status
 * @property {string|null} lastTestAt
 * @property {'SUCCESS'|'FAILURE'|null} lastTestOutcome
 * @property {string|null} lastTestError
 * @property {string} createdAt
 * @property {string} updatedAt
 */

export const marketplaceConnectionService = {
  /** GET /api/v1/channels/:channelId/marketplace-connection */
  getMarketplaceConnection(channelId) {
    return apiRequest({ method: 'GET', url: `/channels/${channelId}/marketplace-connection` });
  },

  /**
   * POST /api/v1/channels/:channelId/marketplace-connection
   * @param {string} channelId
   * @param {{ credentials: Record<string, unknown>, configuration?: Record<string, unknown> }} body
   */
  upsertMarketplaceConnection(channelId, body) {
    return apiRequest({
      method: 'POST',
      url: `/channels/${channelId}/marketplace-connection`,
      data: body,
    });
  },

  /**
   * PATCH /api/v1/channels/:channelId/marketplace-connection
   * @param {string} channelId
   * @param {{ credentials?: Record<string, unknown>, configuration?: Record<string, unknown> }} body
   */
  patchMarketplaceConnection(channelId, body) {
    return apiRequest({
      method: 'PATCH',
      url: `/channels/${channelId}/marketplace-connection`,
      data: body,
    });
  },

  /** DELETE /api/v1/channels/:channelId/marketplace-connection */
  deleteMarketplaceConnection(channelId) {
    return apiRequest({
      method: 'DELETE',
      url: `/channels/${channelId}/marketplace-connection`,
    });
  },

  /** POST /api/v1/channels/:channelId/marketplace-connection/test */
  testMarketplaceConnection(channelId) {
    return apiRequest({
      method: 'POST',
      url: `/channels/${channelId}/marketplace-connection/test`,
      data: {},
    });
  },
};
