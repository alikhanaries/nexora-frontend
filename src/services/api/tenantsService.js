import { apiRequest } from './apiClient.js';

/**
 * @typedef {Object} Tenant
 * @property {string} id
 * @property {string} slug
 * @property {string} name
 * @property {'ACTIVE'|'SUSPENDED'|'CLOSED'} status
 * @property {string} createdAt
 * @property {string} updatedAt
 */

export const tenantsService = {
  /**
   * @param {{ slug: string, name: string }} body
   */
  createTenant(body) {
    return apiRequest({ method: 'POST', url: '/tenants', data: body });
  },

  getTenant(tenantId) {
    return apiRequest({ method: 'GET', url: `/tenants/${tenantId}` });
  },

  suspendTenant(tenantId) {
    return apiRequest({ method: 'POST', url: `/tenants/${tenantId}/suspend` });
  },

  reactivateTenant(tenantId) {
    return apiRequest({ method: 'POST', url: `/tenants/${tenantId}/reactivate` });
  },

  closeTenant(tenantId) {
    return apiRequest({ method: 'POST', url: `/tenants/${tenantId}/close` });
  },
};
