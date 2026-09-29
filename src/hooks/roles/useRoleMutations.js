import { useMutation, useQueryClient } from '@tanstack/react-query';
import { roleQueryKeys } from '../../constants/roleQueryKeys.js';
import { rolesService } from '../../services/api/rolesService.js';

export function useCreateRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body) => rolesService.createRole(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roleQueryKeys.lists() });
    },
  });
}

export function useAssignMembershipRole(membershipId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (roleId) => rolesService.assignRoleToMembership(membershipId, roleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roleQueryKeys.membershipPermissions(membershipId) });
    },
  });
}

export function useRemoveMembershipRole(membershipId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (roleId) => rolesService.removeRoleFromMembership(membershipId, roleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roleQueryKeys.membershipPermissions(membershipId) });
    },
  });
}
