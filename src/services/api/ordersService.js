import { apiRequest } from './apiClient.js';

/**
 * @typedef {Object} OrderSummary
 * @property {string} id
 * @property {string} tenantId
 * @property {string} channelId
 * @property {string|null} externalOrderReference
 * @property {string} orderNumber
 * @property {string} status
 * @property {string} currency
 * @property {number} subtotalMinor
 * @property {number} discountMinor
 * @property {number} taxMinor
 * @property {number} shippingMinor
 * @property {number} totalMinor
 * @property {string} createdAt
 * @property {string} updatedAt
 * @property {string|null} confirmedAt
 * @property {string|null} cancelledAt
 * @property {string|null} shippedAt
 * @property {string|null} deliveredAt
 */

/**
 * @typedef {OrderSummary & {
 *   lines: import('./ordersService.js').OrderLine[],
 *   customer: import('./ordersService.js').OrderCustomer|null,
 * }} OrderDetail
 */

/**
 * @typedef {Object} OrderLine
 * @property {string} id
 * @property {string} productId
 * @property {string|null} offerId
 * @property {string} stockLocationId
 * @property {string} merchantSku
 * @property {string} productTypeSnapshot
 * @property {number} quantity
 * @property {number} cancelledQuantity
 * @property {number} shippedQuantity
 * @property {number} returnedQuantity
 * @property {number} unitPriceMinor
 * @property {number} discountMinor
 * @property {number} taxMinor
 * @property {number} lineTotalMinor
 * @property {string} currency
 * @property {string} status
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * @typedef {Object} OrderCustomer
 * @property {string} id
 * @property {string|null} externalCustomerReference
 * @property {string|null} firstName
 * @property {string|null} lastName
 * @property {string|null} email
 * @property {string|null} phone
 * @property {string|null} companyName
 * @property {Record<string, unknown>|null} billingAddress
 * @property {Record<string, unknown>|null} shippingAddress
 * @property {Record<string, unknown>} metadata
 * @property {string} createdAt
 */

export const ordersService = {
  /** GET /api/v1/orders */
  listOrders(params) {
    return apiRequest({ method: 'GET', url: '/orders', params });
  },

  /** GET /api/v1/orders/:orderId */
  getOrder(orderId) {
    return apiRequest({ method: 'GET', url: `/orders/${orderId}` });
  },

  /**
   * POST /api/v1/orders — requires Idempotency-Key header.
   * @param {Record<string, unknown>} body
   * @param {string} idempotencyKey
   */
  createOrder(body, idempotencyKey) {
    return apiRequest({
      method: 'POST',
      url: '/orders',
      data: body,
      headers: { 'Idempotency-Key': idempotencyKey },
    });
  },

  /** POST /api/v1/orders/:orderId/confirm */
  confirmOrder(orderId) {
    return apiRequest({ method: 'POST', url: `/orders/${orderId}/confirm`, data: {} });
  },
};
