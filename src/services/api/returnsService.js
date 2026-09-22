import { apiRequest } from './apiClient.js';

/**
 * @typedef {Object} ReturnLine
 * @property {string} id
 * @property {string} tenantId
 * @property {string} returnId
 * @property {string} orderLineId
 * @property {number} quantity
 * @property {string|null} reason
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * @typedef {Object} ReturnDetail
 * @property {string} id
 * @property {string} tenantId
 * @property {string} orderId
 * @property {string|null} shipmentId
 * @property {string} status
 * @property {string|null} reason
 * @property {string} createdAt
 * @property {string} updatedAt
 * @property {string|null} receivedAt
 * @property {string|null} completedAt
 * @property {ReturnLine[]} lines
 */

export const returnsService = {
  /** GET /api/v1/returns */
  listReturns(params) {
    return apiRequest({ method: 'GET', url: '/returns', params });
  },

  /** GET /api/v1/returns/:returnId */
  getReturn(returnId) {
    return apiRequest({ method: 'GET', url: `/returns/${returnId}` });
  },

  /**
   * POST /api/v1/orders/:orderId/returns — requires Idempotency-Key.
   * @param {string} orderId
   * @param {Record<string, unknown>} body
   * @param {string} idempotencyKey
   */
  createReturn(orderId, body, idempotencyKey) {
    return apiRequest({
      method: 'POST',
      url: `/orders/${orderId}/returns`,
      data: body,
      headers: { 'Idempotency-Key': idempotencyKey },
    });
  },

  approveReturn(returnId) {
    return apiRequest({ method: 'POST', url: `/returns/${returnId}/approve`, data: {} });
  },

  receiveReturn(returnId) {
    return apiRequest({ method: 'POST', url: `/returns/${returnId}/receive`, data: {} });
  },

  completeReturn(returnId) {
    return apiRequest({ method: 'POST', url: `/returns/${returnId}/complete`, data: {} });
  },

  rejectReturn(returnId) {
    return apiRequest({ method: 'POST', url: `/returns/${returnId}/reject`, data: {} });
  },

  cancelReturn(returnId) {
    return apiRequest({ method: 'POST', url: `/returns/${returnId}/cancel`, data: {} });
  },
};
