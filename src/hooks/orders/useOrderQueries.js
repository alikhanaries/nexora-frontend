import { useQuery } from '@tanstack/react-query';
import { DEFAULT_ORDER_LIST_LIMIT } from '../../constants/orderCatalog.js';
import { orderQueryKeys } from '../../constants/orderQueryKeys.js';
import { ordersService } from '../../services/api/ordersService.js';

/**
 * @param {{
 *   limit?: number,
 *   cursor?: string,
 *   status?: string,
 *   channelId?: string,
 *   externalOrderReference?: string,
 *   orderNumber?: string,
 *   createdAfter?: string,
 *   createdBefore?: string,
 * }} filters
 */
export function useOrders(filters) {
  const queryFilters = {
    limit: filters.limit ?? DEFAULT_ORDER_LIST_LIMIT,
    ...(filters.cursor ? { cursor: filters.cursor } : {}),
    ...(filters.status ? { status: filters.status } : {}),
    ...(filters.channelId ? { channelId: filters.channelId } : {}),
    ...(filters.externalOrderReference ? { externalOrderReference: filters.externalOrderReference } : {}),
    ...(filters.orderNumber ? { orderNumber: filters.orderNumber } : {}),
    ...(filters.createdAfter ? { createdAfter: filters.createdAfter } : {}),
    ...(filters.createdBefore ? { createdBefore: filters.createdBefore } : {}),
  };

  return useQuery({
    queryKey: orderQueryKeys.list(queryFilters),
    queryFn: () => ordersService.listOrders(queryFilters),
    placeholderData: (previous) => previous,
  });
}

export function useOrder(orderId) {
  return useQuery({
    queryKey: orderQueryKeys.detail(orderId),
    queryFn: () => ordersService.getOrder(orderId),
    enabled: Boolean(orderId),
  });
}
