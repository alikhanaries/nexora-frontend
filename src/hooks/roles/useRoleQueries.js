import { useQuery } from '@tanstack/react-query';
import { roleQueryKeys } from '../../constants/roleQueryKeys.js';
import { rolesService } from '../../services/api/rolesService.js';

export function useRoles() {
  return useQuery({
    queryKey: roleQueryKeys.list(),
    queryFn: () => rolesService.listRoles(),
    staleTime: 30_000,
  });
}

export function useMembershipEffectivePermissions(membershipId) {
  return useQuery({
    queryKey: roleQueryKeys.membershipPermissions(membershipId),
    queryFn: () => rolesService.getMembershipEffectivePermissions(membershipId),
    enabled: Boolean(membershipId),
  });
}
