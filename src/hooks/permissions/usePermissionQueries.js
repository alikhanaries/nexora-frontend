import { useQuery } from '@tanstack/react-query';
import { permissionQueryKeys } from '../../constants/permissionQueryKeys.js';
import { permissionsService } from '../../services/api/permissionsService.js';

export function usePermissionsCatalog() {
  return useQuery({
    queryKey: permissionQueryKeys.catalog(),
    queryFn: () => permissionsService.listPermissions(),
    staleTime: 300_000,
  });
}
