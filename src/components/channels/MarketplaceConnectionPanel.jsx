import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import { useMemo, useState } from 'react';
import { StatusBadge } from '../common/StatusBadge.jsx';
import { EmptyState } from '../ui/EmptyState.jsx';
import { ErrorState } from '../ui/ErrorState.jsx';
import { PERMISSIONS } from '../../constants/permissions.js';
import { MARKETPLACE_CONNECTION_TEST_OUTCOME } from '../../constants/marketplaceConnectionCatalog.js';
import { usePermissions } from '../../hooks/permissions/usePermissions.js';
import { canShowPermissionAction } from '../../utils/permissionAction.js';
import { getMarketplaceConnectionTestOutcomePresentation } from '../../constants/marketplaceConnectionStatusPresentation.js';
import {
  useDeleteMarketplaceConnection,
  usePatchMarketplaceConnection,
  useTestMarketplaceConnection,
  useUpsertMarketplaceConnection,
} from '../../hooks/channels/useMarketplaceConnectionMutations.js';
import { useMarketplaceConnection } from '../../hooks/channels/useMarketplaceConnectionQueries.js';
import { useNotification } from '../../hooks/useNotification.js';
import { getUserFacingMessage } from '../../services/api/apiError.js';
import { confirmAction } from '../../utils/confirmDialog.js';
import { formatDate } from '../../utils/formatDate.js';
import { formatConfigurationSummary } from '../../utils/marketplaceConnectionForm.js';
import { MarketplaceConnectionFormDialog } from './MarketplaceConnectionFormDialog.jsx';

/**
 * @param {{
 *   channelId: string,
 *   channelName: string,
 *   marketplaceKey: string,
 *   marketplaceLabel: string,
 * }} props
 */
export function MarketplaceConnectionPanel({ channelId, channelName, marketplaceKey, marketplaceLabel }) {
  const { data: connection, isLoading, isError, error, refetch, isFetching } = useMarketplaceConnection(channelId);
  const upsertMutation = useUpsertMarketplaceConnection(channelId);
  const patchMutation = usePatchMarketplaceConnection(channelId);
  const deleteMutation = useDeleteMarketplaceConnection(channelId);
  const testMutation = useTestMarketplaceConnection(channelId);
  const { notify } = useNotification();
  const permission = usePermissions();
  const canManageConnection = canShowPermissionAction(permission, PERMISSIONS.CHANNELS_UPDATE);
  const [dialogMode, setDialogMode] = useState(/** @type {'create' | 'edit' | null} */ (null));

  const isMutating =
    upsertMutation.isPending ||
    patchMutation.isPending ||
    deleteMutation.isPending ||
    testMutation.isPending;

  const lastTestPresentation = useMemo(() => {
    if (!connection?.lastTestOutcome) return null;
    return getMarketplaceConnectionTestOutcomePresentation(connection.lastTestOutcome);
  }, [connection?.lastTestOutcome]);

  const openCreate = () => setDialogMode('create');
  const openEdit = () => setDialogMode('edit');
  const closeDialog = () => setDialogMode(null);

  const handleSubmit = async (body) => {
    if (dialogMode === 'create') {
      await upsertMutation.mutateAsync(body);
      notify('Marketplace connection saved.', 'success');
    } else {
      await patchMutation.mutateAsync(body);
      notify('Marketplace connection updated.', 'success');
    }
    closeDialog();
  };

  const runTest = async () => {
    try {
      await testMutation.mutateAsync();
      notify('Connection test succeeded.', 'success');
      await refetch();
    } catch (mutationError) {
      notify(getUserFacingMessage(mutationError), 'error');
      await refetch();
    }
  };

  const runDisconnect = async () => {
    const result = await confirmAction({
      title: `Disconnect ${marketplaceLabel}?`,
      text: `This removes the active marketplace connection from channel "${channelName}". Stored credentials are disabled on the server.`,
      confirmButtonText: 'Disconnect',
    });
    if (!result.isConfirmed) return;
    try {
      await deleteMutation.mutateAsync();
      notify('Marketplace connection disconnected.', 'success');
    } catch (mutationError) {
      notify(getUserFacingMessage(mutationError), 'error');
    }
  };

  if (isLoading) {
    return (
      <Paper className="mt-4 p-4">
        <Skeleton variant="text" width={200} height={28} />
        <Skeleton variant="rounded" height={96} className="mt-2" />
      </Paper>
    );
  }

  if (isError && error?.httpStatus !== 404) {
    return (
      <Paper className="mt-4 p-4">
        <Typography variant="subtitle2" gutterBottom>
          Marketplace connection
        </Typography>
        <ErrorState
          error={error}
          title={error?.httpStatus === 403 ? 'Unable to view marketplace connection' : 'Connection unavailable'}
          onRetry={() => refetch()}
        />
      </Paper>
    );
  }

  const hasConnection = Boolean(connection);

  return (
    <Paper className="mt-4 p-4">
      <Box className="mb-3 flex flex-wrap items-start justify-between gap-2">
        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Marketplace connection
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Credentials are encrypted by the backend and are never shown after save.
          </Typography>
        </Box>
        {canManageConnection ? (
          hasConnection ? (
            <Box className="flex flex-wrap gap-2">
              <Button variant="outlined" size="small" onClick={openEdit} disabled={isMutating}>
                Configure
              </Button>
              <Button variant="outlined" size="small" onClick={runTest} disabled={isMutating || testMutation.isPending}>
                {testMutation.isPending ? 'Testing…' : 'Test connection'}
              </Button>
              <Button variant="outlined" color="error" size="small" onClick={runDisconnect} disabled={isMutating}>
                Disconnect
              </Button>
            </Box>
          ) : (
            <Button variant="contained" size="small" onClick={openCreate} disabled={isMutating}>
              Connect marketplace
            </Button>
          )
        ) : null}
      </Box>

      {!hasConnection ? (
        <EmptyState
          title="No marketplace connection"
          description="Connect this channel to enable marketplace integration using your marketplace credentials."
        />
      ) : (
        <Box className="grid gap-3 sm:grid-cols-2">
          <Box>
            <Typography variant="caption" color="text.secondary">
              Marketplace
            </Typography>
            <Typography variant="body2">{connection.marketplaceKey}</Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Status
            </Typography>
            <Box className="mt-0.5">
              <StatusBadge status={connection.status} domain="marketplaceConnection" />
            </Box>
          </Box>
          <Box className="sm:col-span-2">
            <Typography variant="caption" color="text.secondary">
              Configuration
            </Typography>
            <Typography variant="body2">{formatConfigurationSummary(connection.configuration)}</Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Last updated
            </Typography>
            <Typography variant="body2">{formatDate(connection.updatedAt)}</Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Last connection test
            </Typography>
            {connection.lastTestAt ? (
              <Box className="mt-0.5 flex flex-wrap items-center gap-2">
                <Typography variant="body2">{formatDate(connection.lastTestAt)}</Typography>
                {lastTestPresentation ? (
                  <Chip
                    size="small"
                    label={lastTestPresentation.label}
                    color={lastTestPresentation.muiColor}
                    variant="outlined"
                  />
                ) : null}
              </Box>
            ) : (
              <Typography variant="body2">—</Typography>
            )}
          </Box>
          {connection.lastTestOutcome === MARKETPLACE_CONNECTION_TEST_OUTCOME.FAILURE &&
          connection.lastTestError ? (
            <Box className="sm:col-span-2">
              <Typography variant="caption" color="text.secondary">
                Last test message
              </Typography>
              <Typography variant="body2" color="error">
                {connection.lastTestError}
              </Typography>
            </Box>
          ) : null}
          {isFetching && !isLoading ? (
            <Typography variant="caption" color="text.secondary" className="sm:col-span-2">
              Refreshing connection…
            </Typography>
          ) : null}
        </Box>
      )}

      {dialogMode ? (
        <MarketplaceConnectionFormDialog
          open
          mode={dialogMode}
          channelName={channelName}
          marketplaceKey={marketplaceKey}
          marketplaceLabel={marketplaceLabel}
          existingConfiguration={connection?.configuration ?? {}}
          isSubmitting={upsertMutation.isPending || patchMutation.isPending}
          onClose={closeDialog}
          onSubmit={handleSubmit}
        />
      ) : null}
    </Paper>
  );
}
