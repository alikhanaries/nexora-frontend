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

/**
 * @param {string | undefined} productId
 */
export function useUpsertProductContent(productId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ locale, body }) => productsService.upsertProductContent(productId, locale, body),
    onSuccess: (content) => {
      if (!productId) return;
      queryClient.setQueryData(productQueryKeys.content(productId), (previous) => {
        const list = Array.isArray(previous) ? previous : [];
        const index = list.findIndex((entry) => entry.locale === content.locale);
        if (index === -1) {
          return [...list, content].sort((a, b) => a.locale.localeCompare(b.locale));
        }
        const next = [...list];
        next[index] = content;
        return next;
      });
    },
  });
}
