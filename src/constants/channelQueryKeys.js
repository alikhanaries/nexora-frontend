export const channelQueryKeys = {
  all: ['channels'],
  lists: () => [...channelQueryKeys.all, 'list'],
  list: (filters) => [...channelQueryKeys.lists(), filters],
  details: () => [...channelQueryKeys.all, 'detail'],
  detail: (channelId) => [...channelQueryKeys.details(), channelId],
  marketplaceConnections: () => [...channelQueryKeys.all, 'marketplace-connection'],
  marketplaceConnection: (channelId) => [...channelQueryKeys.marketplaceConnections(), channelId],
};
