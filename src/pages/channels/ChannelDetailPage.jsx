import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid2';
import Paper from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { PageHeader } from '../../components/common/PageHeader.jsx';
import { StatusBadge } from '../../components/common/StatusBadge.jsx';
import { CHANNEL_STATUS } from '../../constants/channelCatalog.js';
import { useUpdateChannel } from '../../hooks/channels/useChannelMutations.js';
import { useChannel } from '../../hooks/channels/useChannelQueries.js';
import { useMarketplaces } from '../../hooks/marketplaces/useMarketplaceQueries.js';
import { useNotification } from '../../hooks/useNotification.js';
import { ErrorState } from '../../components/ui/ErrorState.jsx';
import { getUserFacingMessage } from '../../services/api/apiError.js';
import { formatConfigurationReferenceDetail } from '../../utils/channelConfigDisplay.js';
import { confirmAction } from '../../utils/confirmDialog.js';
import { formatDate } from '../../utils/formatDate.js';
import { formatMarketplaceLabel } from '../../utils/marketplaceLabel.js';

export function ChannelDetailPage() {
  const { channelId } = useParams();
  const { data: channel, isLoading, isError, error, refetch } = useChannel(channelId);
  const { data: marketplaces } = useMarketplaces();
  const updateMutation = useUpdateChannel(channelId);
  const { notify } = useNotification();

  const runStatusChange = async (nextStatus, options) => {
    if (!channel || channel.status === nextStatus) return;
    const result = await confirmAction(options);
    if (!result.isConfirmed) return;
    try {
      await updateMutation.mutateAsync({ status: nextStatus });
      notify('Channel status updated.', 'success');
    } catch (mutationError) {
      notify(getUserFacingMessage(mutationError), 'error');
    }
  };

  if (isLoading) {
    return (
      <Box className="flex flex-col gap-4">
        <Skeleton variant="text" width={240} height={40} />
        <Skeleton variant="rounded" height={180} />
      </Box>
    );
  }

  if (isError) {
    return (
      <ErrorState
        error={error}
        title={error?.httpStatus === 404 ? 'Channel not found' : 'Unable to load channel'}
        onRetry={() => refetch()}
      />
    );
  }

  if (!channel) return null;

  const statusActions = [];
  if (channel.status !== CHANNEL_STATUS.ACTIVE) {
    statusActions.push(
      <Button
        key="activate"
        variant="outlined"
        color="success"
        size="small"
        disabled={updateMutation.isPending}
        onClick={() =>
          runStatusChange(CHANNEL_STATUS.ACTIVE, {
            title: 'Activate channel?',
            text: `${channel.name} will be marked active and available for operational use.`,
            confirmButtonText: 'Activate',
          })
        }
      >
        Activate
      </Button>,
    );
  }
  if (channel.status !== CHANNEL_STATUS.INACTIVE) {
    statusActions.push(
      <Button
        key="deactivate"
        variant="outlined"
        color="warning"
        size="small"
        disabled={updateMutation.isPending}
        onClick={() =>
          runStatusChange(CHANNEL_STATUS.INACTIVE, {
            title: 'Deactivate channel?',
            text: `${channel.name} will be marked inactive. Offers and orders may be affected.`,
            confirmButtonText: 'Deactivate',
          })
        }
      >
        Deactivate
      </Button>,
    );
  }
  if (channel.status !== CHANNEL_STATUS.SUSPENDED) {
    statusActions.push(
      <Button
        key="suspend"
        variant="outlined"
        color="error"
        size="small"
        disabled={updateMutation.isPending}
        onClick={() =>
          runStatusChange(CHANNEL_STATUS.SUSPENDED, {
            title: 'Suspend channel?',
            text: `${channel.name} will be suspended until reactivated.`,
            confirmButtonText: 'Suspend',
          })
        }
      >
        Suspend
      </Button>,
    );
  }

  return (
    <>
      <Button component={RouterLink} to="/channels" startIcon={<ArrowBackIcon />} size="small" sx={{ mb: 2 }}>
        Back to channels
      </Button>
      <PageHeader
        title={channel.name}
        description={`Channel ID: ${channel.id}`}
        action={
          <Box className="flex flex-wrap gap-2">
            <Button component={RouterLink} to={`/channels/${channel.id}/edit`} variant="outlined" size="small">
              Edit
            </Button>
            {statusActions}
          </Box>
        }
      />
      <Paper className="mb-4 p-4">
        <Typography variant="subtitle2" gutterBottom>
          Channel information
        </Typography>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Marketplace
            </Typography>
            <Typography variant="body2">{formatMarketplaceLabel(marketplaces, channel.marketplaceId)}</Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Status
            </Typography>
            <StatusBadge status={channel.status} domain="channel" />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle2" color="text.secondary">
              External reference
            </Typography>
            <Typography variant="body2">{channel.externalReference ?? '—'}</Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Tenant ID
            </Typography>
            <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
              {channel.tenantId}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Created
            </Typography>
            <Typography variant="body2">{formatDate(channel.createdAt)}</Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Updated
            </Typography>
            <Typography variant="body2">{formatDate(channel.updatedAt)}</Typography>
          </Grid>
        </Grid>
      </Paper>
      <Paper className="p-4">
        <Typography variant="subtitle2" gutterBottom>
          Configuration
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Integration settings are referenced externally. Credentials are never shown in the admin UI.
        </Typography>
        <Typography variant="body2">{formatConfigurationReferenceDetail(channel.configurationReference)}</Typography>
      </Paper>
    </>
  );
}
