import { useMutation, useQueryClient } from '@tanstack/react-query';
import { productQueryKeys } from '../../constants/productQueryKeys.js';
import { productsService } from '../../services/api/productsService.js';

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body) => productsService.createProduct(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productQueryKeys.lists() });
    },
  });
}

export function useUpdateProduct(productId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body) => productsService.updateProduct(productId, body),
    onSuccess: (product) => {
      queryClient.setQueryData(productQueryKeys.detail(product.id), product);
      queryClient.invalidateQueries({ queryKey: productQueryKeys.lists() });
    },
  });
}

export function useDeactivateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (productId) => productsService.deactivateProduct(productId),
    onSuccess: (product) => {
      queryClient.setQueryData(productQueryKeys.detail(product.id), product);
      queryClient.invalidateQueries({ queryKey: productQueryKeys.lists() });
    },
  });
}

export function useArchiveProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (productId) => productsService.archiveProduct(productId),
    onSuccess: (product) => {
      queryClient.setQueryData(productQueryKeys.detail(product.id), product);
      queryClient.invalidateQueries({ queryKey: productQueryKeys.lists() });
    },
  });
}
