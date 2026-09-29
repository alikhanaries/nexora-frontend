import { apiRequest } from './apiClient.js';

/**
 * @typedef {Object} Permission
 * @property {string} id
 * @property {string} key
 * @property {string} description
 * @property {string} createdAt
 */

export const permissionsService = {
  /** GET /api/v1/permissions — scope options for API key create form */
  listPermissions() {
    return apiRequest({ method: 'GET', url: '/permissions' });
  },
};
