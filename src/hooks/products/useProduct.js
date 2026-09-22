import { useQuery } from '@tanstack/react-query';
import { productQueryKeys } from '../../constants/productQueryKeys.js';
import { productsService } from '../../services/api/productsService.js';

/**
 * @param {string | undefined} productId
 */
export function useProduct(productId) {
  return useQuery({
    queryKey: productQueryKeys.detail(productId),
    queryFn: () => productsService.getProduct(productId),
    enabled: Boolean(productId),
  });
}

export function useProductContent(productId) {
  return useQuery({
    queryKey: productQueryKeys.content(productId),
    queryFn: () => productsService.listProductContent(productId),
    enabled: Boolean(productId),
  });
}
