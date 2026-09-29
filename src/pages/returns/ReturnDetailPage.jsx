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
import {
  canApproveReturn,
  canCancelReturn,
  canCompleteReturn,
  canReceiveReturn,
  canRejectReturn,
} from '../../constants/returnCatalog.js';
import {
  useApproveReturn,
  useCancelReturn,
  useCompleteReturn,
  useReceiveReturn,
  useRejectReturn,
} from '../../hooks/returns/useReturnMutations.js';
import { useReturn } from '../../hooks/returns/useReturnQueries.js';
import { useOrder } from '../../hooks/orders/useOrderQueries.js';
import { useNotification } from '../../hooks/useNotification.js';
import { ErrorState } from '../../components/ui/ErrorState.jsx';
import { getUserFacingMessage } from '../../services/api/apiError.js';
import { confirmAction } from '../../utils/confirmDialog.js';
import { formatDate } from '../../utils/formatDate.js';

export function ReturnDetailPage() {
  const { returnId } = useParams();
  const { data: returnDetail, isLoading, isError, error, refetch } = useReturn(returnId);
  const orderId = returnDetail?.orderId;
  const { data: order } = useOrder(orderId);
  const approveMutation = useApproveReturn(returnId, orderId);
  const receiveMutation = useReceiveReturn(returnId, orderId);
  const completeMutation = useCompleteReturn(returnId, orderId);
  const rejectMutation = useRejectReturn(returnId, orderId);
  const cancelMutation = useCancelReturn(returnId, orderId);
  const { notify } = useNotification();

  const orderLineById = Object.fromEntries((order?.lines ?? []).map((line) => [line.id, line]));

  const runApprove = async () => {
    const result = await confirmAction({
      title: 'Approve return?',
      text: 'Approve this return request?',
      confirmButtonText: 'Approve',
    });
    if (!result.isConfirmed) return;
    try {
      await approveMutation.mutateAsync();
      notify('Return approved.', 'success');
    } catch (mutationError) {
      notify(getUserFacingMessage(mutationError), 'error');
    }
  };

  const runReceive = async () => {
    const result = await confirmAction({
      title: 'Receive return?',
      text: 'Mark goods as received and restore inventory per backend rules.',
      confirmButtonText: 'Receive',
    });
    if (!result.isConfirmed) return;
    try {
      await receiveMutation.mutateAsync();
      notify('Return received.', 'success');
    } catch (mutationError) {
      notify(getUserFacingMessage(mutationError), 'error');
    }
  };

  const runComplete = async () => {
    const result = await confirmAction({
      title: 'Complete return?',
      text: 'Mark this return as completed.',
      confirmButtonText: 'Complete',
    });
    if (!result.isConfirmed) return;
    try {
      await completeMutation.mutateAsync();
      notify('Return completed.', 'success');
    } catch (mutationError) {
      notify(getUserFacingMessage(mutationError), 'error');
    }
  };

  const runReject = async () => {
    const result = await confirmAction({
      title: 'Reject return?',
      text: 'Reject this return request. This cannot be undone.',
      confirmButtonText: 'Reject',
    });
    if (!result.isConfirmed) return;
    try {
      await rejectMutation.mutateAsync();
      notify('Return rejected.', 'success');
    } catch (mutationError) {
      notify(getUserFacingMessage(mutationError), 'error');
    }
  };

  const runCancel = async () => {
    const result = await confirmAction({
      title: 'Cancel return?',
      text: 'Cancel this return request.',
      confirmButtonText: 'Cancel return',
    });
    if (!result.isConfirmed) return;
    try {
      await cancelMutation.mutateAsync();
      notify('Return cancelled.', 'success');
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
        title={error?.httpStatus === 404 ? 'Return not found' : 'Unable to load return'}
        onRetry={() => refetch()}
      />
    );
  }

  if (!returnDetail) return null;

  const status = returnDetail.status;

  return (
    <>
      <Button component={RouterLink} to="/returns" startIcon={<ArrowBackIcon />} size="small" sx={{ mb: 2 }}>
        Back to returns
      </Button>
      <PageHeader
        title={`Return ${returnDetail.id.slice(0, 8)}…`}
        description={`Order ${order?.orderNumber ?? returnDetail.orderId}`}
        action={
          <Box className="flex flex-wrap gap-2">
            {canApproveReturn(status) ? (
              <Button variant="contained" size="small" onClick={runApprove} disabled={approveMutation.isPending}>
                Approve
              </Button>
            ) : null}
            {canReceiveReturn(status) ? (
              <Button variant="outlined" size="small" onClick={runReceive} disabled={receiveMutation.isPending}>
                Receive
              </Button>
            ) : null}
            {canCompleteReturn(status) ? (
              <Button variant="outlined" size="small" onClick={runComplete} disabled={completeMutation.isPending}>
                Complete
              </Button>
            ) : null}
            {canRejectReturn(status) ? (
              <Button variant="outlined" color="warning" size="small" onClick={runReject} disabled={rejectMutation.isPending}>
                Reject
              </Button>
            ) : null}
            {canCancelReturn(status) ? (
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
            <StatusBadge status={status} domain="return" />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Order
            </Typography>
            <Typography component={RouterLink} to={`/orders/${returnDetail.orderId}`} variant="body2" sx={{ color: 'primary.main' }}>
              {returnDetail.orderId}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Shipment
            </Typography>
            {returnDetail.shipmentId ? (
              <Typography component={RouterLink} to={`/shipments/${returnDetail.shipmentId}`} variant="body2" sx={{ color: 'primary.main' }}>
                {returnDetail.shipmentId}
              </Typography>
            ) : (
              <Typography variant="body2">—</Typography>
            )}
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Reason
            </Typography>
            <Typography variant="body2">{returnDetail.reason ?? '—'}</Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Created
            </Typography>
            <Typography variant="body2">{formatDate(returnDetail.createdAt)}</Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Received
            </Typography>
            <Typography variant="body2">{returnDetail.receivedAt ? formatDate(returnDetail.receivedAt) : '—'}</Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Completed
            </Typography>
            <Typography variant="body2">{returnDetail.completedAt ? formatDate(returnDetail.completedAt) : '—'}</Typography>
          </Grid>
        </Grid>
      </Paper>

      <Typography variant="subtitle1" className="mb-2">
        Return lines
      </Typography>
      <TableContainer component={Paper} className="overflow-x-auto">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Order line</TableCell>
              <TableCell>SKU</TableCell>
              <TableCell align="right">Qty</TableCell>
              <TableCell>Reason</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {returnDetail.lines.map((line) => (
              <TableRow key={line.id}>
                <TableCell sx={{ fontFamily: 'monospace', fontSize: 12 }}>{line.orderLineId}</TableCell>
                <TableCell>{orderLineById[line.orderLineId]?.merchantSku ?? '—'}</TableCell>
                <TableCell align="right">{line.quantity}</TableCell>
                <TableCell>{line.reason ?? '—'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
