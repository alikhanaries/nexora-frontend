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
import { PRICE_STATUS } from '../../constants/priceCatalog.js';
import { useDeactivatePrice } from '../../hooks/pricing/usePricingMutations.js';
import { usePrice } from '../../hooks/pricing/usePricingQueries.js';
import { useNotification } from '../../hooks/useNotification.js';
import { ErrorState } from '../../components/ui/ErrorState.jsx';
import { formatDate } from '../../utils/formatDate.js';
import { formatMoneyMinor } from '../../utils/money.js';
import { confirmAction } from '../../utils/confirmDialog.js';

export function PriceDetailPage() {
  const { priceId } = useParams();
  const { data: price, isLoading, isError, error, refetch } = usePrice(priceId);
  const deactivateMutation = useDeactivatePrice();
  const { notify } = useNotification();

  const runDeactivate = async () => {
    if (!price) return;
    const result = await confirmAction({
      title: 'Deactivate price?',
      text: `${formatMoneyMinor(price.amountMinor, price.currency)} — product ${price.productId}`,
      confirmButtonText: 'Deactivate',
    });
    if (!result.isConfirmed) return;
    await deactivateMutation.mutateAsync(price.id);
    notify('Price deactivated.', 'success');
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
        title={error?.httpStatus === 404 ? 'Price not found' : 'Unable to load price'}
        onRetry={() => refetch()}
      />
    );
  }

  if (!price) return null;

  return (
    <>
      <Button component={RouterLink} to="/pricing" startIcon={<ArrowBackIcon />} size="small" sx={{ mb: 2 }}>
        Back to pricing
      </Button>
      <PageHeader
        title={formatMoneyMinor(price.amountMinor, price.currency)}
        description={`Price ID: ${price.id}`}
        action={
          <Box className="flex flex-wrap gap-2">
            <Button component={RouterLink} to={`/pricing/${price.id}/edit`} variant="outlined" size="small">
              Edit
            </Button>
            {price.status === PRICE_STATUS.ACTIVE ? (
              <Button variant="outlined" color="warning" size="small" onClick={runDeactivate}>
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
              Product
            </Typography>
            <Typography component={RouterLink} to={`/products/${price.productId}`} variant="body2" sx={{ color: 'primary.main' }}>
              {price.productId}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Status
            </Typography>
            <StatusBadge status={price.status} domain="pricing" />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Amount (minor units)
            </Typography>
            <Typography variant="body2">{price.amountMinor}</Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Currency
            </Typography>
            <Typography variant="body2">{price.currency}</Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Channel
            </Typography>
            <Typography variant="body2">{price.channelId ?? '—'}</Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Validity
            </Typography>
            <Typography variant="body2">From {formatDate(price.validFrom)}</Typography>
            <Typography variant="body2">To {price.validTo ? formatDate(price.validTo) : '—'}</Typography>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
}
