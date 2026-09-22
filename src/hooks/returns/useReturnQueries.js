import { useQuery } from '@tanstack/react-query';
import { DEFAULT_RETURN_LIST_LIMIT } from '../../constants/returnCatalog.js';
import { returnQueryKeys } from '../../constants/returnQueryKeys.js';
import { returnsService } from '../../services/api/returnsService.js';

/**
 * @param {{ limit?: number, cursor?: string, orderId?: string, status?: string }} filters
 */
export function useReturns(filters) {
  const queryFilters = {
    limit: filters.limit ?? DEFAULT_RETURN_LIST_LIMIT,
    ...(filters.cursor ? { cursor: filters.cursor } : {}),
    ...(filters.orderId ? { orderId: filters.orderId } : {}),
    ...(filters.status ? { status: filters.status } : {}),
  };

  return useQuery({
    queryKey: returnQueryKeys.list(queryFilters),
    queryFn: () => returnsService.listReturns(queryFilters),
    placeholderData: (previous) => previous,
  });
}

export function useReturn(returnId) {
  return useQuery({
    queryKey: returnQueryKeys.detail(returnId),
    queryFn: () => returnsService.getReturn(returnId),
    enabled: Boolean(returnId),
  });
}
