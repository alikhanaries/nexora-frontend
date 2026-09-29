import Button from '@mui/material/Button';
import { Link as RouterLink } from 'react-router-dom';
import { PageHeader } from '../../components/common/PageHeader.jsx';
import { MembershipRolesPanel } from '../../components/roles/MembershipRolesPanel.jsx';
import { RolesTable } from '../../components/roles/RolesTable.jsx';
import { EmptyState } from '../../components/ui/EmptyState.jsx';
import { ErrorState } from '../../components/ui/ErrorState.jsx';
import { PERMISSIONS } from '../../constants/permissions.js';
import { usePermissions } from '../../hooks/permissions/usePermissions.js';
import { useRoles } from '../../hooks/roles/useRoleQueries.js';
import { canShowPermissionAction } from '../../utils/permissionAction.js';

export function RolesListPage() {
  const { data: roles, isLoading, isError, error, refetch } = useRoles();
  const permission = usePermissions();
  const canManage = canShowPermissionAction(permission, PERMISSIONS.ROLES_MANAGE);

  const list = roles ?? [];

  return (
    <>
      <PageHeader
        title="Roles"
        description="Tenant roles from GET /roles. Assign roles to memberships when you have the membership UUID."
        action={
          canManage ? (
            <Button component={RouterLink} to="/roles/new" variant="contained" size="small">
              Create role
            </Button>
          ) : null
        }
      />

      {isError ? <ErrorState error={error} onRetry={() => refetch()} /> : null}

      {!isError && !isLoading && list.length === 0 ? (
        <EmptyState
          title="No custom roles yet"
          description="System roles may still apply. Create a custom role to bundle permission keys."
          action={
            canManage ? (
              <Button component={RouterLink} to="/roles/new" variant="contained" size="small">
                Create role
              </Button>
            ) : null
          }
        />
      ) : null}

      {!isError && (isLoading || list.length > 0) ? (
        <RolesTable roles={list} isLoading={isLoading} />
      ) : null}

      <div className="mt-6">
        <MembershipRolesPanel />
      </div>
    </>
  );
}
