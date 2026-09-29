import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid2';
import Paper from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { PageHeader } from '../../components/common/PageHeader.jsx';
import { StatusBadge } from '../../components/common/StatusBadge.jsx';
import { MARKETPLACE_STATUS } from '../../constants/marketplaceCatalog.js';
import { useChannels } from '../../hooks/channels/useChannelQueries.js';
import { useUpdateMarketplace } from '../../hooks/marketplaces/useMarketplaceMutations.js';
import { useMarketplace } from '../../hooks/marketplaces/useMarketplaceQueries.js';
import { useNotification } from '../../hooks/useNotification.js';
import { ErrorState } from '../../components/ui/ErrorState.jsx';
import { getUserFacingMessage } from '../../services/api/apiError.js';
import { confirmAction } from '../../utils/confirmDialog.js';
import { formatDate } from '../../utils/formatDate.js';

export function MarketplaceDetailPage() {
  const { marketplaceId } = useParams();
  const { data: marketplace, isLoading, isError, error, refetch } = useMarketplace(marketplaceId);
  const { data: channels, isLoading: channelsLoading } = useChannels({ marketplaceId });
  const updateMutation = useUpdateMarketplace(marketplaceId);
  const { notify } = useNotification();

  const runStatusChange = async (nextStatus, options) => {
    if (!marketplace || marketplace.status === nextStatus) return;
    const result = await confirmAction(options);
    if (!result.isConfirmed) return;
    try {
      await updateMutation.mutateAsync({ status: nextStatus });
      notify('Marketplace status updated.', 'success');
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
        title={error?.httpStatus === 404 ? 'Marketplace not found' : 'Unable to load marketplace'}
        onRetry={() => refetch()}
      />
    );
  }

  if (!marketplace) return null;

  const channelList = channels ?? [];

  return (
    <>
      <Button component={RouterLink} to="/marketplaces" startIcon={<ArrowBackIcon />} size="small" sx={{ mb: 2 }}>
        Back to marketplaces
      </Button>
      <PageHeader
        title={marketplace.name}
        description={`Marketplace ID: ${marketplace.id}`}
        action={
          <Box className="flex flex-wrap gap-2">
            <Button component={RouterLink} to={`/marketplaces/${marketplace.id}/edit`} variant="outlined" size="small">
              Edit
            </Button>
            {marketplace.status !== MARKETPLACE_STATUS.ACTIVE ? (
              <Button
                variant="outlined"
                color="success"
                size="small"
                disabled={updateMutation.isPending}
                onClick={() =>
                  runStatusChange(MARKETPLACE_STATUS.ACTIVE, {
                    title: 'Activate marketplace?',
                    text: `${marketplace.name} will be marked active and available for new channels.`,
                    confirmButtonText: 'Activate',
                  })
                }
              >
                Activate
              </Button>
            ) : null}
            {marketplace.status !== MARKETPLACE_STATUS.INACTIVE ? (
              <Button
                variant="outlined"
                color="warning"
                size="small"
                disabled={updateMutation.isPending}
                onClick={() =>
                  runStatusChange(MARKETPLACE_STATUS.INACTIVE, {
                    title: 'Deactivate marketplace?',
                    text: `${marketplace.name} will be marked inactive. Existing channels are not changed automatically.`,
                    confirmButtonText: 'Deactivate',
                  })
                }
              >
                Deactivate
              </Button>
            ) : null}
          </Box>
        }
      />
      <Paper className="mb-4 p-4">
        <Typography variant="subtitle2" gutterBottom>
          Marketplace information
        </Typography>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Key
            </Typography>
            <Typography variant="body2" fontFamily="monospace">
              {marketplace.key}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Status
            </Typography>
            <StatusBadge status={marketplace.status} domain="marketplace" />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Created
            </Typography>
            <Typography variant="body2">{formatDate(marketplace.createdAt)}</Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Updated
            </Typography>
            <Typography variant="body2">{formatDate(marketplace.updatedAt)}</Typography>
          </Grid>
        </Grid>
      </Paper>
      <Paper className="p-4">
        <Box className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <Typography variant="subtitle2">Tenant channels</Typography>
          <Button
            component={RouterLink}
            to={`/channels?marketplaceId=${marketplace.id}`}
            size="small"
            variant="text"
          >
            View in channels
          </Button>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Channels referencing this marketplace (from the channels list API).
        </Typography>
        {channelsLoading ? (
          <Skeleton variant="rounded" height={120} />
        ) : channelList.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No channels use this marketplace yet.
          </Typography>
        ) : (
          <Box className="overflow-x-auto">
            <Table size="small" aria-label="Channels for marketplace">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {channelList.map((channel) => (
                  <TableRow key={channel.id}>
                    <TableCell>
                      <Typography
                        component={RouterLink}
                        to={`/channels/${channel.id}`}
                        variant="body2"
                        sx={{ color: 'primary.main', textDecoration: 'none' }}
                      >
                        {channel.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={channel.status} domain="channel" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        )}
      </Paper>
    </>
  );
}
