export const shipmentQueryKeys = {
  all: ['shipments'],
  lists: () => [...shipmentQueryKeys.all, 'list'],
  list: (filters) => [...shipmentQueryKeys.lists(), filters],
  details: () => [...shipmentQueryKeys.all, 'detail'],
  detail: (shipmentId) => [...shipmentQueryKeys.details(), shipmentId],
};
