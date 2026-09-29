import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid2';
import Paper from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import { Link as RouterLink } from 'react-router-dom';
import { PERMISSIONS } from '../../constants/permissions.js';
import { useAuth } from '../../hooks/useAuth.js';
import { usePermissions } from '../../hooks/permissions/usePermissions.js';
import {
  useCloseTenant,
  useReactivateTenant,
  useSuspendTenant,
} from '../../hooks/tenants/useTenantMutations.js';
import { useTenant } from '../../hooks/tenants/useTenantQueries.js';
import { useNotification } from '../../hooks/useNotification.js';
import { getUserFacingMessage } from '../../services/api/apiError.js';
import { canShowPermissionAction } from '../../utils/permissionAction.js';
import { confirmAction } from '../../utils/confirmDialog.js';
import { StatusBadge } from '../common/StatusBadge.jsx';
import { ErrorState } from '../ui/ErrorState.jsx';

export function TenantOrganizationPanel() {
  const { user } = useAuth();
  const tenantId = user?.tenantId ?? '';
  const { data: tenant, isLoading, isError, error, refetch } = useTenant(tenantId);
  const permission = usePermissions();
  const canAdmin = canShowPermissionAction(permission, PERMISSIONS.TENANT_ADMIN);
  const { notify } = useNotification();

  const suspendMutation = useSuspendTenant(tenantId);
  const reactivateMutation = useReactivateTenant(tenantId);
  const closeMutation = useCloseTenant(tenantId);
  const lifecyclePending =
    suspendMutation.isPending || reactivateMutation.isPending || closeMutation.isPending;

  const runLifecycle = async (action) => {
    const labels = {
      suspend: { title: 'Suspend tenant?', text: 'Users may lose access until reactivated.', confirm: 'Suspend' },
      reactivate: { title: 'Reactivate tenant?', text: 'Restore normal operation for this tenant.', confirm: 'Reactivate' },
      close: {
        title: 'Close tenant?',
        text: 'This is terminal. Confirm only if your organization intends to shut down this tenant.',
        confirm: 'Close tenant',
      },
    };
    const copy = labels[action];
    const result = await confirmAction(copy);
    if (!result.isConfirmed) return;
    try {
      if (action === 'suspend') await suspendMutation.mutateAsync();
      else if (action === 'reactivate') await reactivateMutation.mutateAsync();
      else await closeMutation.mutateAsync();
      notify(`Tenant ${action}d.`, 'success');
    } catch (mutationError) {
      notify(getUserFacingMessage(mutationError), 'error');
    }
  };

  return (
    <Paper variant="outlined" className="p-4">
      <Box className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <Typography variant="subtitle2">Organization</Typography>
        <Button component={RouterLink} to="/roles" size="small" variant="text">
          Roles &amp; membership
        </Button>
      </Box>
      <Typography variant="body2" color="text.secondary" className="mb-3">
        Tenant metadata from GET /tenants/:tenantId. Lifecycle actions call POST suspend, reactivate, and close with
        tenant.admin when authorized.
      </Typography>

      {isLoading ? <Skeleton variant="rounded" height={120} /> : null}
      {isError ? <ErrorState error={error} onRetry={() => refetch()} /> : null}

      {tenant ? (
        <>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="caption" color="text.secondary">
                Name
              </Typography>
              <Typography variant="body2">{tenant.name}</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="caption" color="text.secondary">
                Slug
              </Typography>
              <Typography variant="body2" fontFamily="monospace">
                {tenant.slug}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="caption" color="text.secondary">
                Status
              </Typography>
              <Typography component="div" variant="body2" className="mt-0.5">
                <StatusBadge status={tenant.status} />
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="caption" color="text.secondary">
                Tenant ID
              </Typography>
              <Typography variant="body2" sx={{ wordBreak: 'break-all', fontFamily: 'monospace', fontSize: 12 }}>
                {tenant.id}
              </Typography>
            </Grid>
          </Grid>

          {canAdmin ? (
            <Box className="mt-3 flex flex-wrap gap-2">
              {tenant.status === 'ACTIVE' ? (
                <Button
                  size="small"
                  variant="outlined"
                  color="warning"
                  disabled={lifecyclePending}
                  onClick={() => runLifecycle('suspend')}
                >
                  Suspend
                </Button>
              ) : null}
              {tenant.status === 'SUSPENDED' ? (
                <Button
                  size="small"
                  variant="outlined"
                  disabled={lifecyclePending}
                  onClick={() => runLifecycle('reactivate')}
                >
                  Reactivate
                </Button>
              ) : null}
              {tenant.status !== 'CLOSED' ? (
                <Button
                  size="small"
                  variant="outlined"
                  color="error"
                  disabled={lifecyclePending}
                  onClick={() => runLifecycle('close')}
                >
                  Close tenant
                </Button>
              ) : null}
            </Box>
          ) : (
            <Alert severity="info" className="mt-3">
              Lifecycle controls require tenant.admin when RBAC is enabled. The API still enforces permissions on each
              request.
            </Alert>
          )}
        </>
      ) : null}
    </Paper>
  );
}
