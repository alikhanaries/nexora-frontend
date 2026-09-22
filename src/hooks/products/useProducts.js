import { useQuery } from '@tanstack/react-query';
import { DEFAULT_PRODUCT_LIST_LIMIT } from '../../constants/productCatalog.js';
import { productQueryKeys } from '../../constants/productQueryKeys.js';
import { productsService } from '../../services/api/productsService.js';

/**
 * @param {{ limit?: number, cursor?: string, status?: string }} filters
 */
export function useProducts(filters) {
  const queryFilters = {
    limit: filters.limit ?? DEFAULT_PRODUCT_LIST_LIMIT,
    ...(filters.cursor ? { cursor: filters.cursor } : {}),
    ...(filters.status ? { status: filters.status } : {}),
  };

  return useQuery({
    queryKey: productQueryKeys.list(queryFilters),
    queryFn: () => productsService.listProducts(queryFilters),
    placeholderData: (previous) => previous,
  });
}
