import { WEBHOOK_DELIVERY_STATUS } from './webhookCatalog.js';

/** @type {Record<string, { label: string, muiColor: 'success' | 'default' | 'warning' | 'error' | 'info' }>} */
export const webhookDeliveryStatusPresentation = {
  [WEBHOOK_DELIVERY_STATUS.PENDING]: { label: 'Pending', muiColor: 'default' },
  [WEBHOOK_DELIVERY_STATUS.DELIVERING]: { label: 'Delivering', muiColor: 'info' },
  [WEBHOOK_DELIVERY_STATUS.DELIVERED]: { label: 'Delivered', muiColor: 'success' },
  [WEBHOOK_DELIVERY_STATUS.FAILED]: { label: 'Failed', muiColor: 'warning' },
  [WEBHOOK_DELIVERY_STATUS.DEAD_LETTERED]: { label: 'Dead letter', muiColor: 'error' },
};

export function getWebhookDeliveryStatusPresentation(status) {
  return webhookDeliveryStatusPresentation[status] ?? { label: status, muiColor: 'default' };
}
