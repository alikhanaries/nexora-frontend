import { WEBHOOK_SUBSCRIPTION_STATUS } from './webhookCatalog.js';

/** @type {Record<string, { label: string, muiColor: 'success' | 'default' | 'error' }>} */
export const webhookSubscriptionStatusPresentation = {
  [WEBHOOK_SUBSCRIPTION_STATUS.ACTIVE]: { label: 'Active', muiColor: 'success' },
  [WEBHOOK_SUBSCRIPTION_STATUS.DISABLED]: { label: 'Disabled', muiColor: 'default' },
  [WEBHOOK_SUBSCRIPTION_STATUS.DELETED]: { label: 'Deleted', muiColor: 'error' },
};

export function getWebhookSubscriptionStatusPresentation(status) {
  return webhookSubscriptionStatusPresentation[status] ?? { label: status, muiColor: 'default' };
}
