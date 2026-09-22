import { useMutation, useQueryClient } from '@tanstack/react-query';
import { inventoryQueryKeys } from '../../constants/inventoryQueryKeys.js';
import { inventoryService } from '../../services/api/inventoryService.js';

function invalidateInventoryQueries(queryClient) {
  queryClient.invalidateQueries({ queryKey: inventoryQueryKeys.all });
}

export function useCreateStockLocation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body) => inventoryService.createStockLocation(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inventoryQueryKeys.locations() });
    },
  });
}

export function useAdjustInventory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body) => inventoryService.adjustInventory(body),
    onSuccess: () => invalidateInventoryQueries(queryClient),
  });
}

export function useReceiveInventory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body) => inventoryService.receiveInventory(body),
    onSuccess: () => invalidateInventoryQueries(queryClient),
  });
}

export function useReserveInventory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body) => inventoryService.reserveInventory(body),
    onSuccess: () => invalidateInventoryQueries(queryClient),
  });
}

export function useReleaseInventory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body) => inventoryService.releaseInventory(body),
    onSuccess: () => invalidateInventoryQueries(queryClient),
  });
}
