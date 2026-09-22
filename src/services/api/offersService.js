import { OFFER_STATUS } from '../../constants/offerCatalog.js';
import { apiRequest } from './apiClient.js';

/**
 * @typedef {Object} Offer
 * @property {string} id
 * @property {string} tenantId
 * @property {string} productId
 * @property {string} channelId
 * @property {string} status DRAFT | ACTIVE | INACTIVE | SUSPENDED
 * @property {string|null} externalReference
 * @property {string|null} priceReference
 * @property {string} listingStatus UNLISTED | LISTED | DELISTED
 * @property {string} createdAt
 * @property {string} updatedAt
 */

export const offersService = {
  /** GET /api/v1/offers */
  listOffers(params) {
    return apiRequest({ method: 'GET', url: '/offers', params });
  },

  /** GET /api/v1/offers/:offerId */
  getOffer(offerId) {
    return apiRequest({ method: 'GET', url: `/offers/${offerId}` });
  },

  /** POST /api/v1/offers */
  createOffer(body) {
    return apiRequest({ method: 'POST', url: '/offers', data: body });
  },

  /** PATCH /api/v1/offers/:offerId — fields and/or lifecycle status */
  updateOffer(offerId, body) {
    return apiRequest({ method: 'PATCH', url: `/offers/${offerId}`, data: body });
  },

  /** POST /api/v1/offers/:offerId/activate */
  activateOffer(offerId, body) {
    return apiRequest({ method: 'POST', url: `/offers/${offerId}/activate`, data: body ?? {} });
  },

  deactivateOffer(offerId) {
    return offersService.updateOffer(offerId, { status: OFFER_STATUS.INACTIVE });
  },

  suspendOffer(offerId) {
    return offersService.updateOffer(offerId, { status: OFFER_STATUS.SUSPENDED });
  },
};
