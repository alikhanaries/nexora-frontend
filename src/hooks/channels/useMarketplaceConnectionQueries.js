import { useQuery } from '@tanstack/react-query';
import { channelQueryKeys } from '../../constants/channelQueryKeys.js';
import { marketplaceConnectionService } from '../../services/api/marketplaceConnectionService.js';

export function useMarketplaceConnection(channelId) {
  return useQuery({
    queryKey: channelQueryKeys.marketplaceConnection(channelId),
    queryFn: async () => {
      try {
        return await marketplaceConnectionService.getMarketplaceConnection(channelId);
      } catch (error) {
        if (error?.httpStatus === 404) {
          return null;
        }
        throw error;
      }
    },
    enabled: Boolean(channelId),
  });
}
