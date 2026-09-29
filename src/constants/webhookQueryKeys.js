export const webhookQueryKeys = {
  all: ['webhooks'],
  lists: () => [...webhookQueryKeys.all, 'list'],
  list: (filters) => [...webhookQueryKeys.lists(), filters],
  details: () => [...webhookQueryKeys.all, 'detail'],
  detail: (webhookId) => [...webhookQueryKeys.details(), webhookId],
  deliveries: (webhookId) => [...webhookQueryKeys.all, 'deliveries', webhookId],
  deliveryList: (webhookId, filters) => [...webhookQueryKeys.deliveries(webhookId), filters],
  deliveryDetail: (webhookId, deliveryId) => [
    ...webhookQueryKeys.deliveries(webhookId),
    'detail',
    deliveryId,
  ],
};
