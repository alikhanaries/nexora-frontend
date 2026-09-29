import { apiRequest } from './apiClient.js';

/**
 * @typedef {Object} Role
 * @property {string} id
 * @property {string} tenantId
 * @property {string} name
 * @property {string|null} systemKey
 * @property {'ACTIVE'|'INACTIVE'} status
 * @property {boolean} isSystem
 * @property {string[]} permissionKeys
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * @typedef {Object} EffectivePermissions
 * @property {string} membershipId
 * @property {string[]} permissions
 */

export const rolesService = {
  listRoles() {
    return apiRequest({ method: 'GET', url: '/roles' });
  },

  /**
   * @param {{ name: string, permissionKeys: string[] }} body
   */
  createRole(body) {
    return apiRequest({ method: 'POST', url: '/roles', data: body });
  },

  getMembershipEffectivePermissions(membershipId) {
    return apiRequest({
      method: 'GET',
      url: `/memberships/${membershipId}/roles`,
    });
  },

  assignRoleToMembership(membershipId, roleId) {
    return apiRequest({
      method: 'POST',
      url: `/memberships/${membershipId}/roles`,
      data: { roleId },
    });
  },

  removeRoleFromMembership(membershipId, roleId) {
    return apiRequest({
      method: 'DELETE',
      url: `/memberships/${membershipId}/roles/${roleId}`,
    });
  },
};
