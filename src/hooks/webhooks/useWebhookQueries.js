import { useQuery } from '@tanstack/react-query';
import { webhookQueryKeys } from '../../constants/webhookQueryKeys.js';
import { webhooksService } from '../../services/api/webhooksService.js';

/**
 * @param {{ limit?: number, cursor?: string, status?: string }} [filters]
 */
export function useWebhooks(filters = {}) {
  const queryFilters = {
    ...(filters.limit ? { limit: filters.limit } : {}),
    ...(filters.cursor ? { cursor: filters.cursor } : {}),
    ...(filters.status ? { status: filters.status } : {}),
  };

  return useQuery({
    queryKey: webhookQueryKeys.list(queryFilters),
    queryFn: () => webhooksService.listWebhooks(queryFilters),
    staleTime: 30_000,
  });
}

export function useWebhook(webhookId) {
  return useQuery({
    queryKey: webhookQueryKeys.detail(webhookId),
    queryFn: () => webhooksService.getWebhook(webhookId),
    enabled: Boolean(webhookId),
  });
}

/**
 * @param {string} webhookId
 * @param {{ limit?: number, cursor?: string, status?: string, eventType?: string }} [filters]
 */
export function useWebhookDeliveries(webhookId, filters = {}) {
  const queryFilters = {
    ...(filters.limit ? { limit: filters.limit } : {}),
    ...(filters.cursor ? { cursor: filters.cursor } : {}),
    ...(filters.status ? { status: filters.status } : {}),
    ...(filters.eventType ? { eventType: filters.eventType } : {}),
  };

  return useQuery({
    queryKey: webhookQueryKeys.deliveryList(webhookId, queryFilters),
    queryFn: () => webhooksService.listWebhookDeliveries(webhookId, queryFilters),
    enabled: Boolean(webhookId),
    staleTime: 20_000,
  });
}

export function useWebhookDelivery(webhookId, deliveryId) {
  return useQuery({
    queryKey: webhookQueryKeys.deliveryDetail(webhookId, deliveryId),
    queryFn: () => webhooksService.getWebhookDelivery(webhookId, deliveryId),
    enabled: Boolean(webhookId && deliveryId),
  });
}
