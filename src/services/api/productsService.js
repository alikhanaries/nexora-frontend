import { apiRequest } from './apiClient.js';

/**
 * @typedef {import('../../constants/productCatalog.js').PRODUCT_STATUS} ProductStatus
 * @typedef {import('../../constants/productCatalog.js').PRODUCT_TYPE} ProductType
 */

/**
 * @typedef {Object} Product
 * @property {string} id
 * @property {string} tenantId
 * @property {string} merchantSku
 * @property {string|null} externalReference
 * @property {string} productType
 * @property {string} status
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * @typedef {Object} ProductContent
 * @property {string} id
 * @property {string} productId
 * @property {string} locale
 * @property {string|null} title
 * @property {string|null} description
 * @property {string|null} brand
 * @property {Record<string, unknown>} attributes
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * @typedef {Object} ProductListParams
 * @property {number} [limit]
 * @property {string} [cursor]
 * @property {string} [status]
 */

/**
 * @typedef {Object} ProductListResult
 * @property {Product[]} items
 * @property {string|null} nextCursor
 * @property {boolean} hasMore
 */

export const productsService = {
  /**
   * GET /api/v1/products
   * @param {ProductListParams} params
   * @returns {Promise<ProductListResult>}
   */
  listProducts(params) {
    return apiRequest({
      method: 'GET',
      url: '/products',
      params,
    });
  },

  /**
   * GET /api/v1/products/:productId
   * @param {string} productId
   * @returns {Promise<Product>}
   */
  getProduct(productId) {
    return apiRequest({
      method: 'GET',
      url: `/products/${productId}`,
    });
  },

  /**
   * POST /api/v1/products
   * @param {{ merchantSku: string, externalReference?: string|null, productType?: string }} body
   * @returns {Promise<Product>}
   */
  createProduct(body) {
    return apiRequest({
      method: 'POST',
      url: '/products',
      data: body,
    });
  },

  /**
   * PATCH /api/v1/products/:productId
   * @param {string} productId
   * @param {{ externalReference?: string|null, productType?: string }} body
   * @returns {Promise<Product>}
   */
  updateProduct(productId, body) {
    return apiRequest({
      method: 'PATCH',
      url: `/products/${productId}`,
      data: body,
    });
  },

  /**
   * POST /api/v1/products/:productId/deactivate
   * @param {string} productId
   * @returns {Promise<Product>}
   */
  deactivateProduct(productId) {
    return apiRequest({
      method: 'POST',
      url: `/products/${productId}/deactivate`,
    });
  },

  /**
   * POST /api/v1/products/:productId/archive
   * @param {string} productId
   * @returns {Promise<Product>}
   */
  archiveProduct(productId) {
    return apiRequest({
      method: 'POST',
      url: `/products/${productId}/archive`,
    });
  },

  /**
   * GET /api/v1/products/:productId/content
   * @param {string} productId
   * @returns {Promise<ProductContent[]>}
   */
  listProductContent(productId) {
    return apiRequest({
      method: 'GET',
      url: `/products/${productId}/content`,
    });
  },
};
