export const marketplaceQueryKeys = {
  all: ['marketplaces'],
  lists: () => [...marketplaceQueryKeys.all, 'list'],
  list: (filters) => [...marketplaceQueryKeys.lists(), filters],
};
