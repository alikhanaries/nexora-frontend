import { useMutation, useQueryClient } from '@tanstack/react-query';
import { offerQueryKeys } from '../../constants/offerQueryKeys.js';
import { offersService } from '../../services/api/offersService.js';

export function useCreateOffer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body) => offersService.createOffer(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: offerQueryKeys.lists() });
    },
  });
}

export function useUpdateOffer(offerId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body) => offersService.updateOffer(offerId, body),
    onSuccess: (offer) => {
      queryClient.setQueryData(offerQueryKeys.detail(offer.id), offer);
      queryClient.invalidateQueries({ queryKey: offerQueryKeys.lists() });
    },
  });
}

export function useActivateOffer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ offerId, body }) => offersService.activateOffer(offerId, body),
    onSuccess: (offer) => {
      queryClient.setQueryData(offerQueryKeys.detail(offer.id), offer);
      queryClient.invalidateQueries({ queryKey: offerQueryKeys.lists() });
    },
  });
}

export function useDeactivateOffer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (offerId) => offersService.deactivateOffer(offerId),
    onSuccess: (offer) => {
      queryClient.setQueryData(offerQueryKeys.detail(offer.id), offer);
      queryClient.invalidateQueries({ queryKey: offerQueryKeys.lists() });
    },
  });
}

export function useSuspendOffer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (offerId) => offersService.suspendOffer(offerId),
    onSuccess: (offer) => {
      queryClient.setQueryData(offerQueryKeys.detail(offer.id), offer);
      queryClient.invalidateQueries({ queryKey: offerQueryKeys.lists() });
    },
  });
}
