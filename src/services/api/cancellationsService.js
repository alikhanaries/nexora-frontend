import { apiRequest } from './apiClient.js';

/**
 * @typedef {Object} CancellationLine
 * @property {string} id
 * @property {string} tenantId
 * @property {string} cancellationId
 * @property {string} orderLineId
 * @property {number} quantity
 * @property {string} createdAt
 */

/**
 * @typedef {Object} CancellationSummary
 * @property {string} id
 * @property {string} tenantId
 * @property {string} orderId
 * @property {string} status
 * @property {string|null} reason
 * @property {string} createdAt
 * @property {string} updatedAt
 * @property {string|null} completedAt
 * @property {CancellationLine[]|undefined} lines
 */

export const cancellationsService = {
  /** GET /api/v1/cancellations */
  listCancellations(params) {
    return apiRequest({ method: 'GET', url: '/cancellations', params });
  },

  /** GET /api/v1/cancellations/:cancellationId */
  getCancellation(cancellationId) {
    return apiRequest({ method: 'GET', url: `/cancellations/${cancellationId}` });
  },

  /**
   * POST /api/v1/cancellations — requires Idempotency-Key header.
   * @param {Record<string, unknown>} body
   * @param {string} idempotencyKey
   */
  createCancellation(body, idempotencyKey) {
    return apiRequest({
      method: 'POST',
      url: '/cancellations',
      data: body,
      headers: { 'Idempotency-Key': idempotencyKey },
    });
  },
};
