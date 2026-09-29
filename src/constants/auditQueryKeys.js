export const auditQueryKeys = {
  all: ['audit-events'],
  lists: () => [...auditQueryKeys.all, 'list'],
  list: (filters) => [...auditQueryKeys.lists(), filters],
};
