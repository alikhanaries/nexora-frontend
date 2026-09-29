export const cancellationQueryKeys = {
  all: ['cancellations'],
  lists: () => [...cancellationQueryKeys.all, 'list'],
  list: (filters) => [...cancellationQueryKeys.lists(), filters],
  details: () => [...cancellationQueryKeys.all, 'detail'],
  detail: (cancellationId) => [...cancellationQueryKeys.details(), cancellationId],
};
