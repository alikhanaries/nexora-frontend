export const inventoryQueryKeys = {
  all: ['inventory'],
  locations: () => [...inventoryQueryKeys.all, 'locations'],
  locationDetail: (stockLocationId) => [...inventoryQueryKeys.all, 'location', stockLocationId],
  balances: (filters) => [...inventoryQueryKeys.all, 'balances', filters],
};
