import { useQuery } from '@tanstack/react-query';
import { DEFAULT_CANCELLATION_LIST_LIMIT } from '../../constants/cancellationCatalog.js';
import { cancellationQueryKeys } from '../../constants/cancellationQueryKeys.js';
import { cancellationsService } from '../../services/api/cancellationsService.js';

/**
 * @param {{
 *   limit?: number,
 *   cursor?: string,
 *   orderId?: string,
 *   status?: string,
 * }} filters
 */
export function useCancellations(filters) {
  const queryFilters = {
    limit: filters.limit ?? DEFAULT_CANCELLATION_LIST_LIMIT,
    ...(filters.cursor ? { cursor: filters.cursor } : {}),
    ...(filters.orderId ? { orderId: filters.orderId } : {}),
    ...(filters.status ? { status: filters.status } : {}),
  };

  return useQuery({
    queryKey: cancellationQueryKeys.list(queryFilters),
    queryFn: () => cancellationsService.listCancellations(queryFilters),
    placeholderData: (previous) => previous,
  });
}

export function useCancellation(cancellationId) {
  return useQuery({
    queryKey: cancellationQueryKeys.detail(cancellationId),
    queryFn: () => cancellationsService.getCancellation(cancellationId),
    enabled: Boolean(cancellationId),
  });
}
