import { useQuery } from '@tanstack/react-query';
import { DEFAULT_SHIPMENT_LIST_LIMIT } from '../../constants/shipmentCatalog.js';
import { shipmentQueryKeys } from '../../constants/shipmentQueryKeys.js';
import { shipmentsService } from '../../services/api/shipmentsService.js';

/**
 * @param {{
 *   limit?: number,
 *   cursor?: string,
 *   orderId?: string,
 *   status?: string,
 *   trackingNumber?: string,
 * }} filters
 */
export function useShipments(filters) {
  const queryFilters = {
    limit: filters.limit ?? DEFAULT_SHIPMENT_LIST_LIMIT,
    ...(filters.cursor ? { cursor: filters.cursor } : {}),
    ...(filters.orderId ? { orderId: filters.orderId } : {}),
    ...(filters.status ? { status: filters.status } : {}),
    ...(filters.trackingNumber ? { trackingNumber: filters.trackingNumber } : {}),
  };

  return useQuery({
    queryKey: shipmentQueryKeys.list(queryFilters),
    queryFn: () => shipmentsService.listShipments(queryFilters),
    placeholderData: (previous) => previous,
  });
}

export function useShipment(shipmentId) {
  return useQuery({
    queryKey: shipmentQueryKeys.detail(shipmentId),
    queryFn: () => shipmentsService.getShipment(shipmentId),
    enabled: Boolean(shipmentId),
  });
}
