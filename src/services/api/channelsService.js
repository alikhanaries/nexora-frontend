import { apiRequest } from './apiClient.js';

/**
 * @typedef {Object} Channel
 * @property {string} id
 * @property {string} tenantId
 * @property {string} marketplaceId
 * @property {string} name
 * @property {string|null} externalReference
 * @property {string} status ACTIVE | INACTIVE | SUSPENDED
 * @property {string|null} configurationReference
 * @property {string} createdAt
 * @property {string} updatedAt
 */

export const channelsService = {
  /** GET /api/v1/channels — full array, optional status & marketplaceId filters */
  listChannels(params) {
    return apiRequest({ method: 'GET', url: '/channels', params });
  },

  /** GET /api/v1/channels/:channelId */
  getChannel(channelId) {
    return apiRequest({ method: 'GET', url: `/channels/${channelId}` });
  },

  /** POST /api/v1/channels */
  createChannel(body) {
    return apiRequest({ method: 'POST', url: '/channels', data: body });
  },

  /** PATCH /api/v1/channels/:channelId */
  updateChannel(channelId, body) {
    return apiRequest({ method: 'PATCH', url: `/channels/${channelId}`, data: body });
  },
};
