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
import { OFFER_STATUS } from '../../constants/offerCatalog.js';
import { useChannels } from '../../hooks/channels/useChannelQueries.js';
import {
  useActivateOffer,
  useDeactivateOffer,
  useSuspendOffer,
} from '../../hooks/offers/useOfferMutations.js';
import { useOffer } from '../../hooks/offers/useOfferQueries.js';
import { useNotification } from '../../hooks/useNotification.js';
import { ErrorState } from '../../components/ui/ErrorState.jsx';
import { getUserFacingMessage } from '../../services/api/apiError.js';
import { formatChannelLabel } from '../../utils/channelLabel.js';
import { formatDate } from '../../utils/formatDate.js';
import {
  confirmOfferActivation,
  confirmOfferDeactivation,
  confirmOfferSuspend,
} from '../../utils/offerActivateDialog.js';

export function OfferDetailPage() {
  const { offerId } = useParams();
  const { data: offer, isLoading, isError, error, refetch } = useOffer(offerId);
  const { data: channels } = useChannels();
  const activateMutation = useActivateOffer();
  const deactivateMutation = useDeactivateOffer();
  const suspendMutation = useSuspendOffer();
  const { notify } = useNotification();

  const channelLabel = offer ? formatChannelLabel(channels, offer.channelId) : '';

  const runActivate = async () => {
    if (!offer) return;
    const result = await confirmOfferActivation({
      productId: offer.productId,
      channelId: offer.channelId,
      channelLabel: channels?.find((c) => c.id === offer.channelId)?.name,
    });
    if (!result.confirmed) return;
    try {
      await activateMutation.mutateAsync({ offerId: offer.id, body: result.body });
      notify('Offer activated.', 'success');
    } catch (mutationError) {
      notify(getUserFacingMessage(mutationError), 'error');
    }
  };

  const runSuspend = async () => {
    if (!offer) return;
    const result = await confirmOfferSuspend(offer, channels?.find((c) => c.id === offer.channelId)?.name);
    if (!result.isConfirmed) return;
    try {
      await suspendMutation.mutateAsync(offer.id);
      notify('Offer suspended.', 'success');
    } catch (mutationError) {
      notify(getUserFacingMessage(mutationError), 'error');
    }
  };

  const runDeactivate = async () => {
    if (!offer) return;
    const result = await confirmOfferDeactivation(offer, channels?.find((c) => c.id === offer.channelId)?.name);
    if (!result.isConfirmed) return;
    try {
      await deactivateMutation.mutateAsync(offer.id);
      notify('Offer deactivated.', 'success');
    } catch (mutationError) {
      notify(getUserFacingMessage(mutationError), 'error');
    }
  };

  if (isLoading) {
    return (
      <Box className="flex flex-col gap-4">
        <Skeleton variant="text" width={240} height={40} />
        <Skeleton variant="rounded" height={200} />
      </Box>
    );
  }

  if (isError) {
    return (
      <ErrorState
        error={error}
        title={error?.httpStatus === 404 ? 'Offer not found' : 'Unable to load offer'}
        onRetry={() => refetch()}
      />
    );
  }

  if (!offer) return null;

  const canEdit = offer.status !== OFFER_STATUS.INACTIVE;
  const canActivate =
    offer.status === OFFER_STATUS.DRAFT || offer.status === OFFER_STATUS.SUSPENDED;
  const canSuspend = offer.status === OFFER_STATUS.ACTIVE;
  const canDeactivate = offer.status !== OFFER_STATUS.INACTIVE;

  return (
    <>
      <Button component={RouterLink} to="/offers" startIcon={<ArrowBackIcon />} size="small" sx={{ mb: 2 }}>
        Back to offers
      </Button>
      <PageHeader
        title={`Offer ${offer.id.slice(0, 8)}…`}
        description={`Product ${offer.productId}`}
        action={
          <Box className="flex flex-wrap gap-2">
            {canEdit ? (
              <Button component={RouterLink} to={`/offers/${offer.id}/edit`} variant="outlined" size="small">
                Edit
              </Button>
            ) : null}
            {canActivate ? (
              <Button variant="contained" size="small" onClick={runActivate} disabled={activateMutation.isPending}>
                Activate
              </Button>
            ) : null}
            {canSuspend ? (
              <Button variant="outlined" size="small" onClick={runSuspend} disabled={suspendMutation.isPending}>
                Suspend
              </Button>
            ) : null}
            {canDeactivate ? (
              <Button variant="outlined" color="warning" size="small" onClick={runDeactivate} disabled={deactivateMutation.isPending}>
                Deactivate
              </Button>
            ) : null}
          </Box>
        }
      />
      <Paper className="p-4">
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Lifecycle status
            </Typography>
            <StatusBadge status={offer.status} domain="offer" />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Listing status
            </Typography>
            <StatusBadge status={offer.listingStatus} domain="listing" />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Product
            </Typography>
            <Typography component={RouterLink} to={`/products/${offer.productId}`} variant="body2" sx={{ color: 'primary.main' }}>
              {offer.productId}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Channel
            </Typography>
            <Typography variant="body2">{channelLabel}</Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Price reference
            </Typography>
            {offer.priceReference ? (
              <Typography component={RouterLink} to={`/pricing/${offer.priceReference}`} variant="body2" sx={{ color: 'primary.main' }}>
                {offer.priceReference}
              </Typography>
            ) : (
              <Typography variant="body2">—</Typography>
            )}
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle2" color="text.secondary">
              External reference
            </Typography>
            <Typography variant="body2">{offer.externalReference ?? '—'}</Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Created
            </Typography>
            <Typography variant="body2">{formatDate(offer.createdAt)}</Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Updated
            </Typography>
            <Typography variant="body2">{formatDate(offer.updatedAt)}</Typography>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
}
