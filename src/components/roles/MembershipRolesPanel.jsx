import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { PERMISSIONS } from '../../constants/permissions.js';
import { usePermissions } from '../../hooks/permissions/usePermissions.js';
import {
  useAssignMembershipRole,
  useRemoveMembershipRole,
} from '../../hooks/roles/useRoleMutations.js';
import { useMembershipEffectivePermissions, useRoles } from '../../hooks/roles/useRoleQueries.js';
import { useNotification } from '../../hooks/useNotification.js';
import { getUserFacingMessage } from '../../services/api/apiError.js';
import { canShowPermissionAction } from '../../utils/permissionAction.js';
import { ErrorState } from '../ui/ErrorState.jsx';

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * @param {{ initialMembershipId?: string }} props
 */
export function MembershipRolesPanel({ initialMembershipId = '' }) {
  const [membershipIdInput, setMembershipIdInput] = useState(initialMembershipId);
  const [activeMembershipId, setActiveMembershipId] = useState(
    UUID_PATTERN.test(initialMembershipId) ? initialMembershipId : '',
  );
  const [assignRoleId, setAssignRoleId] = useState('');
  const [removeRoleId, setRemoveRoleId] = useState('');

  const permission = usePermissions();
  const canManage = canShowPermissionAction(permission, PERMISSIONS.ROLES_MANAGE);
  const { notify } = useNotification();

  const rolesQuery = useRoles();
  const effectiveQuery = useMembershipEffectivePermissions(activeMembershipId);
  const assignMutation = useAssignMembershipRole(activeMembershipId);
  const removeMutation = useRemoveMembershipRole(activeMembershipId);

  const roles = rolesQuery.data ?? [];
  const effective = effectiveQuery.data;

  const loadMembership = () => {
    const trimmed = membershipIdInput.trim();
    if (!UUID_PATTERN.test(trimmed)) {
      notify('Enter a valid membership UUID.', 'warning');
      return;
    }
    setActiveMembershipId(trimmed);
  };

  const handleAssign = async () => {
    if (!assignRoleId) return;
    try {
      await assignMutation.mutateAsync(assignRoleId);
      notify('Role assigned.', 'success');
      setAssignRoleId('');
    } catch (error) {
      notify(getUserFacingMessage(error), 'error');
    }
  };

  const handleRemove = async () => {
    if (!removeRoleId) return;
    try {
      await removeMutation.mutateAsync(removeRoleId);
      notify('Role removed.', 'success');
      setRemoveRoleId('');
    } catch (error) {
      notify(getUserFacingMessage(error), 'error');
    }
  };

  return (
    <Paper variant="outlined" className="p-4">
      <Typography variant="subtitle2" gutterBottom>
        Membership roles
      </Typography>
      <Typography variant="body2" color="text.secondary" className="mb-3">
        Load effective permissions for a membership, then assign or remove tenant roles. Membership IDs are not returned
        on GET /auth/me yet — use your database or support tooling to obtain the UUID.
      </Typography>

      <Box className="mb-3 flex flex-wrap items-end gap-2">
        <TextField
          label="Membership ID"
          size="small"
          value={membershipIdInput}
          onChange={(e) => setMembershipIdInput(e.target.value)}
          sx={{ minWidth: 320 }}
          placeholder="00000000-0000-4000-8000-000000000000"
        />
        <Button variant="contained" size="small" onClick={loadMembership}>
          Load
        </Button>
      </Box>

      {!activeMembershipId ? (
        <Alert severity="info">Enter a membership UUID and click Load to call GET /memberships/:id/roles.</Alert>
      ) : null}

      {activeMembershipId && effectiveQuery.isError ? (
        <ErrorState error={effectiveQuery.error} onRetry={() => effectiveQuery.refetch()} />
      ) : null}

      {effective ? (
        <Box className="mb-3">
          <Typography variant="caption" color="text.secondary">
            Effective permissions ({effective.permissions.length})
          </Typography>
          <Box className="mt-1 flex flex-wrap gap-1">
            {effective.permissions.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No permissions resolved for this membership.
              </Typography>
            ) : (
              effective.permissions.map((key) => <Chip key={key} label={key} size="small" variant="outlined" />)
            )}
          </Box>
        </Box>
      ) : null}

      {activeMembershipId && canManage ? (
        <Box className="flex flex-col gap-3 border-t border-gray-200 pt-3 dark:border-gray-700">
          <Box className="flex flex-wrap items-end gap-2">
            <FormControl size="small" sx={{ minWidth: 260 }}>
              <InputLabel id="assign-role-label">Assign role</InputLabel>
              <Select
                labelId="assign-role-label"
                label="Assign role"
                value={assignRoleId}
                onChange={(e) => setAssignRoleId(e.target.value)}
              >
                {roles.map((role) => (
                  <MenuItem key={role.id} value={role.id}>
                    {role.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              variant="outlined"
              size="small"
              disabled={!assignRoleId || assignMutation.isPending}
              onClick={handleAssign}
            >
              Assign
            </Button>
          </Box>
          <Box className="flex flex-wrap items-end gap-2">
            <FormControl size="small" sx={{ minWidth: 260 }}>
              <InputLabel id="remove-role-label">Remove role</InputLabel>
              <Select
                labelId="remove-role-label"
                label="Remove role"
                value={removeRoleId}
                onChange={(e) => setRemoveRoleId(e.target.value)}
              >
                {roles.map((role) => (
                  <MenuItem key={role.id} value={role.id}>
                    {role.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              variant="outlined"
              color="warning"
              size="small"
              disabled={!removeRoleId || removeMutation.isPending}
              onClick={handleRemove}
            >
              Remove
            </Button>
          </Box>
        </Box>
      ) : null}

      {activeMembershipId && !canManage ? (
        <Alert severity="info">Role assignment requires the roles.manage permission when RBAC is enabled.</Alert>
      ) : null}
    </Paper>
  );
}
