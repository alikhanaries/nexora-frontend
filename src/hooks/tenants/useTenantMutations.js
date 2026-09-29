import { useMutation, useQueryClient } from '@tanstack/react-query';
import { tenantQueryKeys } from '../../constants/tenantQueryKeys.js';
import { tenantsService } from '../../services/api/tenantsService.js';

export function useCreateTenant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body) => tenantsService.createTenant(body),
    onSuccess: (tenant) => {
      queryClient.setQueryData(tenantQueryKeys.detail(tenant.id), tenant);
    },
  });
}

export function useSuspendTenant(tenantId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => tenantsService.suspendTenant(tenantId),
    onSuccess: (tenant) => {
      queryClient.setQueryData(tenantQueryKeys.detail(tenantId), tenant);
    },
  });
}

export function useReactivateTenant(tenantId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => tenantsService.reactivateTenant(tenantId),
    onSuccess: (tenant) => {
      queryClient.setQueryData(tenantQueryKeys.detail(tenantId), tenant);
    },
  });
}

export function useCloseTenant(tenantId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => tenantsService.closeTenant(tenantId),
    onSuccess: (tenant) => {
      queryClient.setQueryData(tenantQueryKeys.detail(tenantId), tenant);
    },
  });
}
