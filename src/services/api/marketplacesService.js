import { apiRequest } from './apiClient.js';

/**
 * @typedef {Object} Marketplace
 * @property {string} id
 * @property {string} key
 * @property {string} name
 * @property {string} status
 * @property {string} createdAt
 * @property {string} updatedAt
 */

export const marketplacesService = {
  /** GET /api/v1/marketplaces — lookup for channel forms (not full admin UI) */
  listMarketplaces(params) {
    return apiRequest({ method: 'GET', url: '/marketplaces', params });
  },
};
