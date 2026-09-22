import { useQuery } from '@tanstack/react-query';
import { channelQueryKeys } from '../../constants/channelQueryKeys.js';
import { channelsService } from '../../services/api/channelsService.js';

/**
 * Cached channel list for selectors and admin list.
 * @param {{ status?: string, marketplaceId?: string }} [filters]
 */
export function useChannels(filters = {}) {
  const queryFilters = {
    ...(filters.status ? { status: filters.status } : {}),
    ...(filters.marketplaceId ? { marketplaceId: filters.marketplaceId } : {}),
  };

  return useQuery({
    queryKey: channelQueryKeys.list(queryFilters),
    queryFn: () => channelsService.listChannels(queryFilters),
    staleTime: 60_000,
  });
}

export function useChannel(channelId) {
  return useQuery({
    queryKey: channelQueryKeys.detail(channelId),
    queryFn: () => channelsService.getChannel(channelId),
    enabled: Boolean(channelId),
  });
}
