import { apiRequest } from './apiClient.js';

/**
 * @typedef {Object} StockLocation
 * @property {string} id
 * @property {string} tenantId
 * @property {string} name
 * @property {string|null} externalReference
 * @property {string} status
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * @typedef {Object} InventoryBalance
 * @property {string} id
 * @property {string} tenantId
 * @property {string} stockLocationId
 * @property {string} productId
 * @property {number} onHand
 * @property {number} reserved
 * @property {number} available
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * Backend returns onHand, reserved, and available as separate integer fields per balance row.
 * Do not derive available client-side; display API values as authoritative.
 */

export const inventoryService = {
  /** GET /api/v1/stock-locations */
  listStockLocations() {
    return apiRequest({ method: 'GET', url: '/stock-locations' });
  },

  /** POST /api/v1/stock-locations */
  createStockLocation(body) {
    return apiRequest({
      method: 'POST',
      url: '/stock-locations',
      data: body,
    });
  },

  /** GET /api/v1/stock-locations/:stockLocationId */
  getStockLocation(stockLocationId) {
    return apiRequest({
      method: 'GET',
      url: `/stock-locations/${stockLocationId}`,
    });
  },

  /**
   * GET /api/v1/inventory
   * @param {{ stockLocationId?: string }} [params]
   * @returns {Promise<InventoryBalance[]>}
   */
  listInventoryBalances(params) {
    return apiRequest({
      method: 'GET',
      url: '/inventory',
      params,
    });
  },

  /**
   * GET /api/v1/inventory/:productId
   * @param {string} productId
   * @param {{ stockLocationId?: string }} [params]
   */
  listInventoryBalancesForProduct(productId, params) {
    return apiRequest({
      method: 'GET',
      url: `/inventory/${productId}`,
      params,
    });
  },

  /** POST /api/v1/inventory/adjustments */
  adjustInventory(body) {
    return apiRequest({ method: 'POST', url: '/inventory/adjustments', data: body });
  },

  /** POST /api/v1/inventory/receipts */
  receiveInventory(body) {
    return apiRequest({ method: 'POST', url: '/inventory/receipts', data: body });
  },

  /** POST /api/v1/inventory/reservations */
  reserveInventory(body) {
    return apiRequest({ method: 'POST', url: '/inventory/reservations', data: body });
  },

  /** POST /api/v1/inventory/releases */
  releaseInventory(body) {
    return apiRequest({ method: 'POST', url: '/inventory/releases', data: body });
  },
};
