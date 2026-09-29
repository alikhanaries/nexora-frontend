export const tenantQueryKeys = {
  all: ['tenants'],
  detail: (tenantId) => [...tenantQueryKeys.all, tenantId],
};
