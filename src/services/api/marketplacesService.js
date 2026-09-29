import { apiRequest } from './apiClient.js';

/**
 * @typedef {Object} Marketplace
 * @property {string} id
 * @property {string} key
 * @property {string} name
 * @property {string} status ACTIVE | INACTIVE
 * @property {string} createdAt
 * @property {string} updatedAt
 */

export const marketplacesService = {
  /** GET /api/v1/marketplaces — full array, optional status filter */
  listMarketplaces(params) {
    return apiRequest({ method: 'GET', url: '/marketplaces', params });
  },

  /** GET /api/v1/marketplaces/:id */
  getMarketplace(marketplaceId) {
    return apiRequest({ method: 'GET', url: `/marketplaces/${marketplaceId}` });
  },

  /** POST /api/v1/marketplaces */
  createMarketplace(body) {
    return apiRequest({ method: 'POST', url: '/marketplaces', data: body });
  },

  /** PATCH /api/v1/marketplaces/:id */
  updateMarketplace(marketplaceId, body) {
    return apiRequest({ method: 'PATCH', url: `/marketplaces/${marketplaceId}`, data: body });
  },
};
