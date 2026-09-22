import { useMutation, useQueryClient } from '@tanstack/react-query';
import { orderQueryKeys } from '../../constants/orderQueryKeys.js';
import { ordersService } from '../../services/api/ordersService.js';

export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ body, idempotencyKey }) => ordersService.createOrder(body, idempotencyKey),
    onSuccess: (order) => {
      queryClient.setQueryData(orderQueryKeys.detail(order.id), order);
      queryClient.invalidateQueries({ queryKey: orderQueryKeys.lists() });
    },
  });
}

export function useConfirmOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (orderId) => ordersService.confirmOrder(orderId),
    onSuccess: (order) => {
      queryClient.setQueryData(orderQueryKeys.detail(order.id), order);
      queryClient.invalidateQueries({ queryKey: orderQueryKeys.lists() });
    },
  });
}
