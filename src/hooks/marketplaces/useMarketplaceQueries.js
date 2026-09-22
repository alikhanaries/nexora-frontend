import { useQuery } from '@tanstack/react-query';
import { marketplaceQueryKeys } from '../../constants/marketplaceQueryKeys.js';
import { marketplacesService } from '../../services/api/marketplacesService.js';

/**
 * Cached marketplace list for channel admin forms (single request).
 * @param {{ status?: string }} [filters]
 */
export function useMarketplaces(filters = {}) {
  const queryFilters = {
    ...(filters.status ? { status: filters.status } : {}),
  };

  return useQuery({
    queryKey: marketplaceQueryKeys.list(queryFilters),
    queryFn: () => marketplacesService.listMarketplaces(queryFilters),
    staleTime: 120_000,
  });
}
