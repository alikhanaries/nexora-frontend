import { useQuery } from '@tanstack/react-query';
import { marketplaceQueryKeys } from '../../constants/marketplaceQueryKeys.js';
import { marketplacesService } from '../../services/api/marketplacesService.js';

/**
 * Cached marketplace list for admin and channel selectors.
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

export function useMarketplace(marketplaceId) {
  return useQuery({
    queryKey: marketplaceQueryKeys.detail(marketplaceId),
    queryFn: () => marketplacesService.getMarketplace(marketplaceId),
    enabled: Boolean(marketplaceId),
  });
}
