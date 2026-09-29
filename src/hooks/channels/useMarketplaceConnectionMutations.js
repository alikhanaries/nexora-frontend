import { useMutation, useQueryClient } from '@tanstack/react-query';
import { channelQueryKeys } from '../../constants/channelQueryKeys.js';
import { marketplaceConnectionService } from '../../services/api/marketplaceConnectionService.js';

function invalidateConnectionQueries(queryClient, channelId) {
  queryClient.invalidateQueries({ queryKey: channelQueryKeys.marketplaceConnection(channelId) });
  queryClient.invalidateQueries({ queryKey: channelQueryKeys.detail(channelId) });
  queryClient.invalidateQueries({ queryKey: channelQueryKeys.lists() });
}

export function useUpsertMarketplaceConnection(channelId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body) => marketplaceConnectionService.upsertMarketplaceConnection(channelId, body),
    onSuccess: (connection) => {
      queryClient.setQueryData(channelQueryKeys.marketplaceConnection(channelId), connection);
      invalidateConnectionQueries(queryClient, channelId);
    },
  });
}

export function usePatchMarketplaceConnection(channelId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body) => marketplaceConnectionService.patchMarketplaceConnection(channelId, body),
    onSuccess: (connection) => {
      queryClient.setQueryData(channelQueryKeys.marketplaceConnection(channelId), connection);
      invalidateConnectionQueries(queryClient, channelId);
    },
  });
}

export function useDeleteMarketplaceConnection(channelId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => marketplaceConnectionService.deleteMarketplaceConnection(channelId),
    onSuccess: () => {
      queryClient.setQueryData(channelQueryKeys.marketplaceConnection(channelId), null);
      invalidateConnectionQueries(queryClient, channelId);
    },
  });
}

export function useTestMarketplaceConnection(channelId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => marketplaceConnectionService.testMarketplaceConnection(channelId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: channelQueryKeys.marketplaceConnection(channelId) });
    },
  });
}
