import { useQuery } from '@tanstack/react-query';
import { inventoryQueryKeys } from '../../constants/inventoryQueryKeys.js';
import { inventoryService } from '../../services/api/inventoryService.js';

export function useStockLocations() {
  return useQuery({
    queryKey: inventoryQueryKeys.locations(),
    queryFn: () => inventoryService.listStockLocations(),
    staleTime: 2 * 60 * 1000,
  });
}

/**
 * @param {{ stockLocationId?: string }} filters
 */
export function useInventoryBalances(filters) {
  const queryFilters = {
    ...(filters.stockLocationId ? { stockLocationId: filters.stockLocationId } : {}),
  };

  return useQuery({
    queryKey: inventoryQueryKeys.balances(queryFilters),
    queryFn: () => inventoryService.listInventoryBalances(queryFilters),
  });
}
