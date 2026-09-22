import { useMutation, useQueryClient } from '@tanstack/react-query';
import { priceQueryKeys } from '../../constants/priceQueryKeys.js';
import { pricingService } from '../../services/api/pricingService.js';

export function useCreatePrice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body) => pricingService.createPrice(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: priceQueryKeys.lists() });
    },
  });
}

export function useUpdatePrice(priceId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body) => pricingService.updatePrice(priceId, body),
    onSuccess: (price) => {
      queryClient.setQueryData(priceQueryKeys.detail(price.id), price);
      queryClient.invalidateQueries({ queryKey: priceQueryKeys.lists() });
    },
  });
}

export function useDeactivatePrice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (priceId) => pricingService.deactivatePrice(priceId),
    onSuccess: (price) => {
      queryClient.setQueryData(priceQueryKeys.detail(price.id), price);
      queryClient.invalidateQueries({ queryKey: priceQueryKeys.lists() });
    },
  });
}
