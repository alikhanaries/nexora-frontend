import { apiRequest } from './apiClient.js';

/**
 * @typedef {Object} Channel
 * @property {string} id
 * @property {string} tenantId
 * @property {string} marketplaceId
 * @property {string} name
 * @property {string|null} externalReference
 * @property {string} status
 * @property {string|null} configurationReference
 * @property {string} createdAt
 * @property {string} updatedAt
 */

export const channelsService = {
  /** GET /api/v1/channels — full array (no cursor pagination) */
  listChannels(params) {
    return apiRequest({ method: 'GET', url: '/channels', params });
  },
};
