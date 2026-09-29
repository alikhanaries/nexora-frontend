import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cancellationQueryKeys } from '../../constants/cancellationQueryKeys.js';
import { orderQueryKeys } from '../../constants/orderQueryKeys.js';
import { cancellationsService } from '../../services/api/cancellationsService.js';
import { ordersService } from '../../services/api/ordersService.js';

export function useCancelOrder(orderId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body) => ordersService.cancelOrder(orderId, body),
    onSuccess: (cancellation) => {
      if (cancellation?.id) {
        queryClient.setQueryData(cancellationQueryKeys.detail(cancellation.id), cancellation);
      }
      queryClient.invalidateQueries({ queryKey: cancellationQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: orderQueryKeys.detail(orderId) });
      queryClient.invalidateQueries({ queryKey: orderQueryKeys.lists() });
    },
  });
}

export function useCreateCancellation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ body, idempotencyKey }) => cancellationsService.createCancellation(body, idempotencyKey),
    onSuccess: (cancellation) => {
      queryClient.setQueryData(cancellationQueryKeys.detail(cancellation.id), cancellation);
      queryClient.invalidateQueries({ queryKey: cancellationQueryKeys.lists() });
      if (cancellation.orderId) {
        queryClient.invalidateQueries({ queryKey: orderQueryKeys.detail(cancellation.orderId) });
        queryClient.invalidateQueries({ queryKey: orderQueryKeys.lists() });
      }
    },
  });
}
