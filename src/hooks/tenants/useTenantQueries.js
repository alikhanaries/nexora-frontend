import { useQuery } from '@tanstack/react-query';
import { tenantQueryKeys } from '../../constants/tenantQueryKeys.js';
import { tenantsService } from '../../services/api/tenantsService.js';

export function useTenant(tenantId) {
  return useQuery({
    queryKey: tenantQueryKeys.detail(tenantId),
    queryFn: () => tenantsService.getTenant(tenantId),
    enabled: Boolean(tenantId),
    staleTime: 60_000,
  });
}
