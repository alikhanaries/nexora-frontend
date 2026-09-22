export const inventoryQueryKeys = {
  all: ['inventory'],
  locations: () => [...inventoryQueryKeys.all, 'locations'],
  balances: (filters) => [...inventoryQueryKeys.all, 'balances', filters],
};
