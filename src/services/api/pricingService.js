import { PRICE_STATUS } from '../../constants/priceCatalog.js';
import { apiRequest } from './apiClient.js';

/**
 * @typedef {Object} Price
 * @property {string} id
 * @property {string} tenantId
 * @property {string} productId
 * @property {string|null} channelId
 * @property {string} currency
 * @property {number} amountMinor integer minor units
 * @property {string} validFrom ISO datetime
 * @property {string|null} validTo ISO datetime
 * @property {string} status ACTIVE | INACTIVE
 * @property {string} createdAt
 * @property {string} updatedAt
 */

export const pricingService = {
  /** GET /api/v1/prices */
  listPrices(params) {
    return apiRequest({ method: 'GET', url: '/prices', params });
  },

  /** GET /api/v1/prices/:priceId */
  getPrice(priceId) {
    return apiRequest({ method: 'GET', url: `/prices/${priceId}` });
  },

  /** POST /api/v1/prices */
  createPrice(body) {
    return apiRequest({ method: 'POST', url: '/prices', data: body });
  },

  /** PATCH /api/v1/prices/:priceId */
  updatePrice(priceId, body) {
    return apiRequest({ method: 'PATCH', url: `/prices/${priceId}`, data: body });
  },

  /** Deactivate via PATCH status INACTIVE (no separate endpoint). */
  deactivatePrice(priceId) {
    return apiRequest({
      method: 'PATCH',
      url: `/prices/${priceId}`,
      data: { status: PRICE_STATUS.INACTIVE },
    });
  },
};
