import { useQuery } from '@tanstack/react-query';
import { DEFAULT_PRICE_LIST_LIMIT } from '../../constants/priceCatalog.js';
import { priceQueryKeys } from '../../constants/priceQueryKeys.js';
import { pricingService } from '../../services/api/pricingService.js';

/**
 * @param {{ limit?: number, cursor?: string, productId?: string, channelId?: string, currency?: string, status?: string }} filters
 */
export function usePrices(filters) {
  const queryFilters = {
    limit: filters.limit ?? DEFAULT_PRICE_LIST_LIMIT,
    ...(filters.cursor ? { cursor: filters.cursor } : {}),
    ...(filters.productId ? { productId: filters.productId } : {}),
    ...(filters.channelId ? { channelId: filters.channelId } : {}),
    ...(filters.currency ? { currency: filters.currency.toUpperCase() } : {}),
    ...(filters.status ? { status: filters.status } : {}),
  };

  return useQuery({
    queryKey: priceQueryKeys.list(queryFilters),
    queryFn: () => pricingService.listPrices(queryFilters),
    placeholderData: (previous) => previous,
  });
}

export function usePrice(priceId) {
  return useQuery({
    queryKey: priceQueryKeys.detail(priceId),
    queryFn: () => pricingService.getPrice(priceId),
    enabled: Boolean(priceId),
  });
}
