import { useMutation, useQueryClient } from '@tanstack/react-query';
import { orderQueryKeys } from '../../constants/orderQueryKeys.js';
import { shipmentQueryKeys } from '../../constants/shipmentQueryKeys.js';
import { shipmentsService } from '../../services/api/shipmentsService.js';

export function useCreateShipment(orderId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ body, idempotencyKey }) => shipmentsService.createShipment(orderId, body, idempotencyKey),
    onSuccess: (shipment) => {
      queryClient.setQueryData(shipmentQueryKeys.detail(shipment.id), shipment);
      queryClient.invalidateQueries({ queryKey: shipmentQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: orderQueryKeys.detail(orderId) });
    },
  });
}

export function useShipShipment(shipmentId, orderId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body) => shipmentsService.shipShipment(shipmentId, body),
    onSuccess: (shipment) => {
      queryClient.setQueryData(shipmentQueryKeys.detail(shipment.id), shipment);
      queryClient.invalidateQueries({ queryKey: shipmentQueryKeys.lists() });
      if (orderId) {
        queryClient.invalidateQueries({ queryKey: orderQueryKeys.detail(orderId) });
      }
    },
  });
}

export function useDeliverShipment(shipmentId, orderId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => shipmentsService.deliverShipment(shipmentId),
    onSuccess: (shipment) => {
      queryClient.setQueryData(shipmentQueryKeys.detail(shipment.id), shipment);
      queryClient.invalidateQueries({ queryKey: shipmentQueryKeys.lists() });
      if (orderId) {
        queryClient.invalidateQueries({ queryKey: orderQueryKeys.detail(orderId) });
      }
    },
  });
}

export function useCancelShipment(shipmentId, orderId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => shipmentsService.cancelShipment(shipmentId),
    onSuccess: (shipment) => {
      queryClient.setQueryData(shipmentQueryKeys.detail(shipment.id), shipment);
      queryClient.invalidateQueries({ queryKey: shipmentQueryKeys.lists() });
      if (orderId) {
        queryClient.invalidateQueries({ queryKey: orderQueryKeys.detail(orderId) });
      }
    },
  });
}
