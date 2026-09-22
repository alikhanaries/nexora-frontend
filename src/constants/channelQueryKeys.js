export const channelQueryKeys = {
  all: ['channels'],
  lists: () => [...channelQueryKeys.all, 'list'],
  list: (filters) => [...channelQueryKeys.lists(), filters],
};
