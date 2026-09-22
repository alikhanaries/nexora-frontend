export const priceQueryKeys = {
  all: ['pricing'],
  lists: () => [...priceQueryKeys.all, 'list'],
  list: (filters) => [...priceQueryKeys.lists(), filters],
  details: () => [...priceQueryKeys.all, 'detail'],
  detail: (priceId) => [...priceQueryKeys.details(), priceId],
};
