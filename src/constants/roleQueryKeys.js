export const roleQueryKeys = {
  all: ['roles'],
  lists: () => [...roleQueryKeys.all, 'list'],
  list: () => [...roleQueryKeys.lists()],
  membershipPermissions: (membershipId) => [...roleQueryKeys.all, 'membership', membershipId],
};
