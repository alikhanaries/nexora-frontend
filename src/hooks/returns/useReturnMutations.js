import { useMutation, useQueryClient } from '@tanstack/react-query';
import { orderQueryKeys } from '../../constants/orderQueryKeys.js';
import { returnQueryKeys } from '../../constants/returnQueryKeys.js';
import { returnsService } from '../../services/api/returnsService.js';

export function useCreateReturn(orderId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ body, idempotencyKey }) => returnsService.createReturn(orderId, body, idempotencyKey),
    onSuccess: (returnDetail) => {
      queryClient.setQueryData(returnQueryKeys.detail(returnDetail.id), returnDetail);
      queryClient.invalidateQueries({ queryKey: returnQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: orderQueryKeys.detail(orderId) });
    },
  });
}

function useReturnLifecycleMutation(mutationFn, returnId, orderId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: (returnDetail) => {
      queryClient.setQueryData(returnQueryKeys.detail(returnDetail.id), returnDetail);
      queryClient.invalidateQueries({ queryKey: returnQueryKeys.lists() });
      if (orderId) {
        queryClient.invalidateQueries({ queryKey: orderQueryKeys.detail(orderId) });
      }
    },
  });
}

export function useApproveReturn(returnId, orderId) {
  return useReturnLifecycleMutation(() => returnsService.approveReturn(returnId), returnId, orderId);
}

export function useReceiveReturn(returnId, orderId) {
  return useReturnLifecycleMutation(() => returnsService.receiveReturn(returnId), returnId, orderId);
}

export function useCompleteReturn(returnId, orderId) {
  return useReturnLifecycleMutation(() => returnsService.completeReturn(returnId), returnId, orderId);
}

export function useRejectReturn(returnId, orderId) {
  return useReturnLifecycleMutation(() => returnsService.rejectReturn(returnId), returnId, orderId);
}

export function useCancelReturn(returnId, orderId) {
  return useReturnLifecycleMutation(() => returnsService.cancelReturn(returnId), returnId, orderId);
}
