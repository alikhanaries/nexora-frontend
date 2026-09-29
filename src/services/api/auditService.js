import { apiRequest } from './apiClient.js';

/**
 * @typedef {Object} AuditEvent
 * @property {string} id
 * @property {string|null} tenantId
 * @property {'user'|'api-key'|'system'} actorKind
 * @property {string|null} actorId
 * @property {string} eventType
 * @property {string|null} resourceType
 * @property {string|null} resourceId
 * @property {Record<string, unknown>} metadata
 * @property {string|null} ipAddress
 * @property {string|null} requestId
 * @property {string} createdAt
 */

/**
 * @typedef {{ total: number, events: AuditEvent[] }} AuditListResult
 */

export const auditService = {
  /** GET /api/v1/audit */
  listAuditEvents(params) {
    return apiRequest({ method: 'GET', url: '/audit', params });
  },
};
