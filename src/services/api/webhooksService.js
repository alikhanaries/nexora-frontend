import { apiRequest } from './apiClient.js';

/**
 * @typedef {Object} WebhookSubscription
 * @property {string} id
 * @property {string} url
 * @property {string|null} description
 * @property {string[]} eventTypes
 * @property {string} status ACTIVE | DISABLED | DELETED
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * @typedef {Object} WebhookDelivery
 * @property {string} id
 * @property {string} eventId
 * @property {string} eventType
 * @property {string} status
 * @property {number} attemptCount
 * @property {string|null} nextAttemptAt
 * @property {number|null} lastHttpStatus
 * @property {string|null} lastError
 * @property {string|null} deliveredAt
 * @property {string} createdAt
 */

export const webhooksService = {
  listWebhooks(params) {
    return apiRequest({ method: 'GET', url: '/webhooks', params });
  },

  getWebhook(webhookId) {
    return apiRequest({ method: 'GET', url: `/webhooks/${webhookId}` });
  },

  createWebhook(body) {
    return apiRequest({ method: 'POST', url: '/webhooks', data: body });
  },

  updateWebhook(webhookId, body) {
    return apiRequest({ method: 'PATCH', url: `/webhooks/${webhookId}`, data: body });
  },

  deleteWebhook(webhookId) {
    return apiRequest({ method: 'DELETE', url: `/webhooks/${webhookId}` });
  },

  rotateWebhookSecret(webhookId) {
    return apiRequest({ method: 'POST', url: `/webhooks/${webhookId}/rotate-secret` });
  },

  listWebhookDeliveries(webhookId, params) {
    return apiRequest({ method: 'GET', url: `/webhooks/${webhookId}/deliveries`, params });
  },

  getWebhookDelivery(webhookId, deliveryId) {
    return apiRequest({ method: 'GET', url: `/webhooks/${webhookId}/deliveries/${deliveryId}` });
  },
};
