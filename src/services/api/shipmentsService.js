import { apiRequest } from './apiClient.js';

/**
 * @typedef {Object} ShipmentSummary
 * @property {string} id
 * @property {string} tenantId
 * @property {string} orderId
 * @property {string|null} externalReference
 * @property {string|null} carrier
 * @property {string|null} service
 * @property {string|null} trackingNumber
 * @property {string} status
 * @property {string|null} shippedAt
 * @property {string|null} deliveredAt
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * @typedef {Object} ShipmentLine
 * @property {string} id
 * @property {string} tenantId
 * @property {string} shipmentId
 * @property {string} orderLineId
 * @property {number} quantity
 * @property {string} createdAt
 */

/** @typedef {ShipmentSummary & { lines: ShipmentLine[] }} ShipmentDetail */

export const shipmentsService = {
  /** GET /api/v1/shipments */
  listShipments(params) {
    return apiRequest({ method: 'GET', url: '/shipments', params });
  },

  /** GET /api/v1/shipments/:shipmentId */
  getShipment(shipmentId) {
    return apiRequest({ method: 'GET', url: `/shipments/${shipmentId}` });
  },

  /**
   * POST /api/v1/orders/:orderId/shipments — requires Idempotency-Key.
   * @param {string} orderId
   * @param {Record<string, unknown>} body
   * @param {string} idempotencyKey
   */
  createShipment(orderId, body, idempotencyKey) {
    return apiRequest({
      method: 'POST',
      url: `/orders/${orderId}/shipments`,
      data: body,
      headers: { 'Idempotency-Key': idempotencyKey },
    });
  },

  /** POST /api/v1/shipments/:shipmentId/ship */
  shipShipment(shipmentId, body) {
    return apiRequest({
      method: 'POST',
      url: `/shipments/${shipmentId}/ship`,
      data: body ?? {},
    });
  },

  /** POST /api/v1/shipments/:shipmentId/deliver */
  deliverShipment(shipmentId) {
    return apiRequest({ method: 'POST', url: `/shipments/${shipmentId}/deliver`, data: {} });
  },

  /** POST /api/v1/shipments/:shipmentId/cancel */
  cancelShipment(shipmentId) {
    return apiRequest({ method: 'POST', url: `/shipments/${shipmentId}/cancel`, data: {} });
  },
};
