export const productQueryKeys = {
  all: ['products'],
  lists: () => [...productQueryKeys.all, 'list'],
  list: (filters) => [...productQueryKeys.lists(), filters],
  details: () => [...productQueryKeys.all, 'detail'],
  detail: (productId) => [...productQueryKeys.details(), productId],
  content: (productId) => [...productQueryKeys.all, 'content', productId],
};
