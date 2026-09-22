import { useQuery } from '@tanstack/react-query';
import { DEFAULT_OFFER_LIST_LIMIT } from '../../constants/offerCatalog.js';
import { offerQueryKeys } from '../../constants/offerQueryKeys.js';
import { offersService } from '../../services/api/offersService.js';

/**
 * @param {{ limit?: number, cursor?: string, productId?: string, channelId?: string, status?: string }} filters
 */
export function useOffers(filters) {
  const queryFilters = {
    limit: filters.limit ?? DEFAULT_OFFER_LIST_LIMIT,
    ...(filters.cursor ? { cursor: filters.cursor } : {}),
    ...(filters.productId ? { productId: filters.productId } : {}),
    ...(filters.channelId ? { channelId: filters.channelId } : {}),
    ...(filters.status ? { status: filters.status } : {}),
  };

  return useQuery({
    queryKey: offerQueryKeys.list(queryFilters),
    queryFn: () => offersService.listOffers(queryFilters),
    placeholderData: (previous) => previous,
  });
}

export function useOffer(offerId) {
  return useQuery({
    queryKey: offerQueryKeys.detail(offerId),
    queryFn: () => offersService.getOffer(offerId),
    enabled: Boolean(offerId),
  });
}
