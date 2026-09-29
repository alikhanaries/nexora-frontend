export const permissionQueryKeys = {
  all: ['permissions'],
  catalog: () => [...permissionQueryKeys.all, 'catalog'],
};
