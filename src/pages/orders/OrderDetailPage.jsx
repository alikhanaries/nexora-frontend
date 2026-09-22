import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid2';
import Paper from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { PageHeader } from '../../components/common/PageHeader.jsx';
import { StatusBadge } from '../../components/common/StatusBadge.jsx';
import { ORDER_STATUS } from '../../constants/orderCatalog.js';
import { useChannels } from '../../hooks/channels/useChannelQueries.js';
import { useConfirmOrder } from '../../hooks/orders/useOrderMutations.js';
import { useOrder } from '../../hooks/orders/useOrderQueries.js';
import { useNotification } from '../../hooks/useNotification.js';
import { ErrorState } from '../../components/ui/ErrorState.jsx';
import { getUserFacingMessage } from '../../services/api/apiError.js';
import { formatChannelLabel } from '../../utils/channelLabel.js';
import { confirmAction } from '../../utils/confirmDialog.js';
import { formatDate } from '../../utils/formatDate.js';
import { formatMoneyMinor } from '../../utils/money.js';

function formatAddress(address) {
  if (!address || typeof address !== 'object') return '—';
  const parts = ['line1', 'line2', 'city', 'region', 'postalCode', 'countryCode']
    .map((key) => address[key])
    .filter(Boolean);
  return parts.length ? parts.join(', ') : '—';
}

export function OrderDetailPage() {
  const { orderId } = useParams();
  const { data: order, isLoading, isError, error, refetch } = useOrder(orderId);
  const { data: channels } = useChannels();
  const confirmMutation = useConfirmOrder();
  const { notify } = useNotification();

  const runConfirm = async () => {
    if (!order) return;
    const result = await confirmAction({
      title: 'Confirm order?',
      text: `Confirm order ${order.orderNumber}? This may reserve inventory and advance the order lifecycle.`,
      confirmButtonText: 'Confirm order',
    });
    if (!result.isConfirmed) return;
    try {
      await confirmMutation.mutateAsync(order.id);
      notify('Order confirmed.', 'success');
    } catch (mutationError) {
      notify(getUserFacingMessage(mutationError), 'error');
    }
  };

  if (isLoading) {
    return (
      <Box className="flex flex-col gap-4">
        <Skeleton variant="text" width={240} height={40} />
        <Skeleton variant="rounded" height={220} />
      </Box>
    );
  }

  if (isError) {
    return (
      <ErrorState
        error={error}
        title={error?.httpStatus === 404 ? 'Order not found' : 'Unable to load order'}
        onRetry={() => refetch()}
      />
    );
  }

  if (!order) return null;

  const currency = order.currency;
  const canConfirm = order.status === ORDER_STATUS.NEW;

  return (
    <>
      <Button component={RouterLink} to="/orders" startIcon={<ArrowBackIcon />} size="small" sx={{ mb: 2 }}>
        Back to orders
      </Button>
      <PageHeader
        title={order.orderNumber}
        description={`Order ID: ${order.id}`}
        action={
          canConfirm ? (
            <Button variant="contained" size="small" onClick={runConfirm} disabled={confirmMutation.isPending}>
              Confirm order
            </Button>
          ) : null
        }
      />

      <Paper className="mb-4 p-4">
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Status
            </Typography>
            <StatusBadge status={order.status} domain="order" />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Channel
            </Typography>
            <Typography variant="body2">{formatChannelLabel(channels, order.channelId)}</Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="subtitle2" color="text.secondary">
              External reference
            </Typography>
            <Typography variant="body2">{order.externalOrderReference ?? '—'}</Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Created
            </Typography>
            <Typography variant="body2">{formatDate(order.createdAt)}</Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Confirmed
            </Typography>
            <Typography variant="body2">{order.confirmedAt ? formatDate(order.confirmedAt) : '—'}</Typography>
          </Grid>
        </Grid>
      </Paper>

      {order.customer ? (
        <Paper className="mb-4 p-4">
          <Typography variant="subtitle1" className="mb-2">
            Customer
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="body2">
                {[order.customer.firstName, order.customer.lastName].filter(Boolean).join(' ') || '—'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {order.customer.email ?? '—'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {order.customer.phone ?? '—'}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="caption" color="text.secondary">
                Shipping
              </Typography>
              <Typography variant="body2">{formatAddress(order.customer.shippingAddress)}</Typography>
            </Grid>
          </Grid>
        </Paper>
      ) : null}

      <Typography variant="subtitle1" className="mb-2">
        Line items
      </Typography>
      <TableContainer component={Paper} className="mb-4 overflow-x-auto">
        <Table size="small" aria-label="Order lines">
          <TableHead>
            <TableRow>
              <TableCell>SKU</TableCell>
              <TableCell>Product</TableCell>
              <TableCell>Offer</TableCell>
              <TableCell>Location</TableCell>
              <TableCell align="right">Qty</TableCell>
              <TableCell align="right">Unit</TableCell>
              <TableCell align="right">Line total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {order.lines.map((line) => (
              <TableRow key={line.id}>
                <TableCell>{line.merchantSku}</TableCell>
                <TableCell>
                  <Typography
                    component={RouterLink}
                    to={`/products/${line.productId}`}
                    variant="body2"
                    sx={{ fontFamily: 'monospace', fontSize: 12, color: 'primary.main' }}
                  >
                    {line.productId}
                  </Typography>
                </TableCell>
                <TableCell>
                  {line.offerId ? (
                    <Typography
                      component={RouterLink}
                      to={`/offers/${line.offerId}`}
                      variant="body2"
                      sx={{ fontFamily: 'monospace', fontSize: 12, color: 'primary.main' }}
                    >
                      {line.offerId}
                    </Typography>
                  ) : (
                    '—'
                  )}
                </TableCell>
                <TableCell sx={{ fontFamily: 'monospace', fontSize: 12 }}>{line.stockLocationId}</TableCell>
                <TableCell align="right">{line.quantity}</TableCell>
                <TableCell align="right">{formatMoneyMinor(line.unitPriceMinor, line.currency || currency)}</TableCell>
                <TableCell align="right">{formatMoneyMinor(line.lineTotalMinor, line.currency || currency)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Paper className="max-w-md p-4">
        <Typography variant="subtitle1" className="mb-2">
          Totals
        </Typography>
        <Box className="flex flex-col gap-1">
          <Box className="flex justify-between">
            <Typography variant="body2" color="text.secondary">
              Subtotal
            </Typography>
            <Typography variant="body2">{formatMoneyMinor(order.subtotalMinor, currency)}</Typography>
          </Box>
          <Box className="flex justify-between">
            <Typography variant="body2" color="text.secondary">
              Discount
            </Typography>
            <Typography variant="body2">{formatMoneyMinor(order.discountMinor, currency)}</Typography>
          </Box>
          <Box className="flex justify-between">
            <Typography variant="body2" color="text.secondary">
              Tax
            </Typography>
            <Typography variant="body2">{formatMoneyMinor(order.taxMinor, currency)}</Typography>
          </Box>
          <Box className="flex justify-between">
            <Typography variant="body2" color="text.secondary">
              Shipping
            </Typography>
            <Typography variant="body2">{formatMoneyMinor(order.shippingMinor, currency)}</Typography>
          </Box>
          <Box className="flex justify-between border-t border-neutral-200 pt-2">
            <Typography variant="body2" fontWeight={600}>
              Total
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              {formatMoneyMinor(order.totalMinor, currency)}
            </Typography>
          </Box>
        </Box>
      </Paper>
    </>
  );
}
