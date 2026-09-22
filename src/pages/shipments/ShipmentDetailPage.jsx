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
import { useState } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { PageHeader } from '../../components/common/PageHeader.jsx';
import { StatusBadge } from '../../components/common/StatusBadge.jsx';
import { ShipShipmentDialog } from '../../components/shipments/ShipShipmentDialog.jsx';
import {
  canDeliverShipmentStatus,
  canShipShipmentStatus,
  isShipmentCancellableStatus,
} from '../../constants/shipmentCatalog.js';
import {
  useCancelShipment,
  useDeliverShipment,
  useShipShipment,
} from '../../hooks/shipments/useShipmentMutations.js';
import { useShipment } from '../../hooks/shipments/useShipmentQueries.js';
import { useOrder } from '../../hooks/orders/useOrderQueries.js';
import { useNotification } from '../../hooks/useNotification.js';
import { ErrorState } from '../../components/ui/ErrorState.jsx';
import { getUserFacingMessage } from '../../services/api/apiError.js';
import { confirmAction } from '../../utils/confirmDialog.js';
import { formatDate } from '../../utils/formatDate.js';

export function ShipmentDetailPage() {
  const { shipmentId } = useParams();
  const { data: shipment, isLoading, isError, error, refetch } = useShipment(shipmentId);
  const orderId = shipment?.orderId;
  const { data: order } = useOrder(orderId);
  const shipMutation = useShipShipment(shipmentId, orderId);
  const deliverMutation = useDeliverShipment(shipmentId, orderId);
  const cancelMutation = useCancelShipment(shipmentId, orderId);
  const { notify } = useNotification();
  const [shipDialogOpen, setShipDialogOpen] = useState(false);

  const orderLineById = Object.fromEntries((order?.lines ?? []).map((line) => [line.id, line]));

  const runDeliver = async () => {
    if (!shipment) return;
    const result = await confirmAction({
      title: 'Mark as delivered?',
      text: 'Confirm that this shipment has been delivered.',
      confirmButtonText: 'Mark delivered',
    });
    if (!result.isConfirmed) return;
    try {
      await deliverMutation.mutateAsync();
      notify('Shipment marked as delivered.', 'success');
    } catch (mutationError) {
      notify(getUserFacingMessage(mutationError), 'error');
    }
  };

  const runCancel = async () => {
    if (!shipment) return;
    const result = await confirmAction({
      title: 'Cancel shipment?',
      text: 'This shipment will be cancelled. This action is only allowed for created or ready-to-ship shipments.',
      confirmButtonText: 'Cancel shipment',
    });
    if (!result.isConfirmed) return;
    try {
      await cancelMutation.mutateAsync();
      notify('Shipment cancelled.', 'success');
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
        title={error?.httpStatus === 404 ? 'Shipment not found' : 'Unable to load shipment'}
        onRetry={() => refetch()}
      />
    );
  }

  if (!shipment) return null;

  const canShip = canShipShipmentStatus(shipment.status);
  const canDeliver = canDeliverShipmentStatus(shipment.status);
  const canCancel = isShipmentCancellableStatus(shipment.status);

  return (
    <>
      <Button component={RouterLink} to="/shipments" startIcon={<ArrowBackIcon />} size="small" sx={{ mb: 2 }}>
        Back to shipments
      </Button>
      <PageHeader
        title={`Shipment ${shipment.id.slice(0, 8)}…`}
        description={`Order ${order?.orderNumber ?? shipment.orderId}`}
        action={
          <Box className="flex flex-wrap gap-2">
            {canShip ? (
              <Button variant="contained" size="small" onClick={() => setShipDialogOpen(true)}>
                Ship
              </Button>
            ) : null}
            {canDeliver ? (
              <Button variant="outlined" size="small" onClick={runDeliver} disabled={deliverMutation.isPending}>
                Deliver
              </Button>
            ) : null}
            {canCancel ? (
              <Button variant="outlined" color="warning" size="small" onClick={runCancel} disabled={cancelMutation.isPending}>
                Cancel
              </Button>
            ) : null}
          </Box>
        }
      />

      <Paper className="mb-4 p-4">
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Status
            </Typography>
            <StatusBadge status={shipment.status} domain="shipment" />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="subtitle2" color="text.secondary">
              External reference
            </Typography>
            <Typography variant="body2">{shipment.externalReference ?? '—'}</Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Carrier / service
            </Typography>
            <Typography variant="body2">
              {[shipment.carrier, shipment.service].filter(Boolean).join(' — ') || '—'}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Tracking number
            </Typography>
            <Typography variant="body2">{shipment.trackingNumber ?? '—'}</Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Shipped
            </Typography>
            <Typography variant="body2">{shipment.shippedAt ? formatDate(shipment.shippedAt) : '—'}</Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Delivered
            </Typography>
            <Typography variant="body2">{shipment.deliveredAt ? formatDate(shipment.deliveredAt) : '—'}</Typography>
          </Grid>
        </Grid>
      </Paper>

      <Typography variant="subtitle1" className="mb-2">
        Shipment lines
      </Typography>
      <TableContainer component={Paper} className="mb-4 overflow-x-auto">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Order line</TableCell>
              <TableCell>SKU</TableCell>
              <TableCell align="right">Quantity</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {shipment.lines.map((line) => (
              <TableRow key={line.id}>
                <TableCell sx={{ fontFamily: 'monospace', fontSize: 12 }}>{line.orderLineId}</TableCell>
                <TableCell>{orderLineById[line.orderLineId]?.merchantSku ?? '—'}</TableCell>
                <TableCell align="right">{line.quantity}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <ShipShipmentDialog
        open={shipDialogOpen}
        onClose={() => setShipDialogOpen(false)}
        isSubmitting={shipMutation.isPending}
        initialCarrier={shipment.carrier}
        initialService={shipment.service}
        initialTracking={shipment.trackingNumber}
        onConfirm={async (body) => {
          try {
            await shipMutation.mutateAsync(body);
            notify('Shipment marked as shipped.', 'success');
            setShipDialogOpen(false);
          } catch (mutationError) {
            notify(getUserFacingMessage(mutationError), 'error');
          }
        }}
      />
    </>
  );
}
