import { useMutation, useQueryClient } from '@tanstack/react-query';
import { marketplaceQueryKeys } from '../../constants/marketplaceQueryKeys.js';
import { marketplacesService } from '../../services/api/marketplacesService.js';

export function useCreateMarketplace() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body) => marketplacesService.createMarketplace(body),
    onSuccess: (marketplace) => {
      queryClient.setQueryData(marketplaceQueryKeys.detail(marketplace.id), marketplace);
      queryClient.invalidateQueries({ queryKey: marketplaceQueryKeys.lists() });
    },
  });
}

export function useUpdateMarketplace(marketplaceId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body) => marketplacesService.updateMarketplace(marketplaceId, body),
    onSuccess: (marketplace) => {
      queryClient.setQueryData(marketplaceQueryKeys.detail(marketplace.id), marketplace);
      queryClient.invalidateQueries({ queryKey: marketplaceQueryKeys.lists() });
    },
  });
}
