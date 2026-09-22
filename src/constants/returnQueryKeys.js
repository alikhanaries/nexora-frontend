export const returnQueryKeys = {
  all: ['returns'],
  lists: () => [...returnQueryKeys.all, 'list'],
  list: (filters) => [...returnQueryKeys.lists(), filters],
  details: () => [...returnQueryKeys.all, 'detail'],
  detail: (returnId) => [...returnQueryKeys.details(), returnId],
};
