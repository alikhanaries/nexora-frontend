import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid2';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import { StatusBadge } from '../common/StatusBadge.jsx';
import { ErrorState } from '../ui/ErrorState.jsx';
import { useWebhookDelivery } from '../../hooks/webhooks/useWebhookQueries.js';
import { formatDate } from '../../utils/formatDate.js';

/**
 * @param {{
 *   open: boolean,
 *   webhookId: string,
 *   deliveryId: string | null,
 *   onClose: () => void,
 * }} props
 */
export function WebhookDeliveryDetailDialog({ open, webhookId, deliveryId, onClose }) {
  const { data: delivery, isLoading, isError, error, refetch } = useWebhookDelivery(
    webhookId,
    deliveryId ?? '',
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Delivery detail</DialogTitle>
      <DialogContent dividers>
        {!deliveryId ? (
          <Typography variant="body2" color="text.secondary">
            No delivery selected.
          </Typography>
        ) : null}
        {deliveryId && isLoading ? <Skeleton variant="rounded" height={120} /> : null}
        {deliveryId && isError ? <ErrorState error={error} onRetry={() => refetch()} /> : null}
        {delivery ? (
          <Grid container spacing={2}>
            <Grid size={12}>
              <Typography variant="caption" color="text.secondary">
                Delivery ID
              </Typography>
              <Typography variant="body2" fontFamily="monospace" sx={{ wordBreak: 'break-all', fontSize: 12 }}>
                {delivery.id}
              </Typography>
            </Grid>
            <Grid size={6}>
              <Typography variant="caption" color="text.secondary">
                Event type
              </Typography>
              <Typography variant="body2" fontFamily="monospace">
                {delivery.eventType}
              </Typography>
            </Grid>
            <Grid size={6}>
              <Typography variant="caption" color="text.secondary">
                Status
              </Typography>
              <Typography component="div" variant="body2" className="mt-0.5">
                <StatusBadge status={delivery.status} domain="webhookDelivery" />
              </Typography>
            </Grid>
            <Grid size={6}>
              <Typography variant="caption" color="text.secondary">
                Attempts
              </Typography>
              <Typography variant="body2">{delivery.attemptCount}</Typography>
            </Grid>
            <Grid size={6}>
              <Typography variant="caption" color="text.secondary">
                Last HTTP status
              </Typography>
              <Typography variant="body2">{delivery.lastHttpStatus ?? '—'}</Typography>
            </Grid>
            <Grid size={6}>
              <Typography variant="caption" color="text.secondary">
                Delivered at
              </Typography>
              <Typography variant="body2">
                {delivery.deliveredAt ? formatDate(delivery.deliveredAt) : '—'}
              </Typography>
            </Grid>
            <Grid size={6}>
              <Typography variant="caption" color="text.secondary">
                Next attempt
              </Typography>
              <Typography variant="body2">
                {delivery.nextAttemptAt ? formatDate(delivery.nextAttemptAt) : '—'}
              </Typography>
            </Grid>
            <Grid size={12}>
              <Typography variant="caption" color="text.secondary">
                Last error
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {delivery.lastError ?? '—'}
              </Typography>
            </Grid>
          </Grid>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
