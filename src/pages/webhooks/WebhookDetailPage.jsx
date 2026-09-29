import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid2';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import Skeleton from '@mui/material/Skeleton';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useCallback, useMemo, useState } from 'react';
import { Link as RouterLink, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { PageHeader } from '../../components/common/PageHeader.jsx';
import { CursorPagination } from '../../components/common/CursorPagination.jsx';
import { StatusBadge } from '../../components/common/StatusBadge.jsx';
import { ApiKeySecretDialog } from '../../components/api-keys/ApiKeySecretDialog.jsx';
import { WebhookDeliveriesTable } from '../../components/webhooks/WebhookDeliveriesTable.jsx';
import { WebhookDeliveryDetailDialog } from '../../components/webhooks/WebhookDeliveryDetailDialog.jsx';
import {
  DEFAULT_WEBHOOK_LIST_LIMIT,
  WEBHOOK_DELIVERY_STATUS_OPTIONS,
  WEBHOOK_SUBSCRIPTION_STATUS,
} from '../../constants/webhookCatalog.js';
import {
  useDeleteWebhook,
  useRotateWebhookSecret,
  useUpdateWebhook,
} from '../../hooks/webhooks/useWebhookMutations.js';
import { useWebhook, useWebhookDeliveries } from '../../hooks/webhooks/useWebhookQueries.js';
import { useNotification } from '../../hooks/useNotification.js';
import { ErrorState } from '../../components/ui/ErrorState.jsx';
import { getUserFacingMessage } from '../../services/api/apiError.js';
import { confirmAction } from '../../utils/confirmDialog.js';
import { formatDate } from '../../utils/formatDate.js';

export function WebhookDetailPage() {
  const navigate = useNavigate();
  const { webhookId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const deliveryStatus = searchParams.get('deliveryStatus') ?? '';
  const deliveryEventType = searchParams.get('deliveryEventType') ?? '';
  const deliveryCursor = searchParams.get('deliveryCursor') ?? '';
  const [deliveryCursorBackStack, setDeliveryCursorBackStack] = useState(/** @type {string[]} */ ([]));
  const [selectedDeliveryId, setSelectedDeliveryId] = useState(/** @type {string | null} */ (null));

  const { data: webhook, isLoading, isError, error, refetch } = useWebhook(webhookId);
  const deliveryFilters = useMemo(
    () => ({
      limit: DEFAULT_WEBHOOK_LIST_LIMIT,
      ...(deliveryCursor ? { cursor: deliveryCursor } : {}),
      ...(deliveryStatus ? { status: deliveryStatus } : {}),
      ...(deliveryEventType ? { eventType: deliveryEventType } : {}),
    }),
    [deliveryCursor, deliveryStatus, deliveryEventType],
  );
  const {
    data: deliveryPage,
    isLoading: deliveriesLoading,
    refetch: refetchDeliveries,
  } = useWebhookDeliveries(webhookId, deliveryFilters);

  const updateMutation = useUpdateWebhook(webhookId);
  const deleteMutation = useDeleteWebhook();
  const rotateMutation = useRotateWebhookSecret();
  const { notify } = useNotification();

  const [secretDialog, setSecretDialog] = useState(
    /** @type {{ open: boolean, secret: string, title: string, helperText?: string }} */ ({
      open: false,
      secret: '',
      title: '',
    }),
  );

  const closeSecretDialog = () => {
    setSecretDialog({ open: false, secret: '', title: '' });
  };

  const updateDeliveryFilter = useCallback(
    (field, value) => {
      setDeliveryCursorBackStack([]);
      const params = new URLSearchParams(searchParams);
      if (value) params.set(field, value);
      else params.delete(field);
      params.delete('deliveryCursor');
      setSearchParams(params);
    },
    [searchParams, setSearchParams],
  );

  const goDeliveriesNext = useCallback(() => {
    if (!deliveryPage?.nextCursor) return;
    setDeliveryCursorBackStack((prev) => [...prev, deliveryCursor]);
    const params = new URLSearchParams(searchParams);
    params.set('deliveryCursor', deliveryPage.nextCursor);
    setSearchParams(params);
  }, [deliveryCursor, deliveryPage?.nextCursor, searchParams, setSearchParams]);

  const goDeliveriesPrevious = useCallback(() => {
    setDeliveryCursorBackStack((prev) => {
      const nextStack = [...prev];
      const previousCursor = nextStack.pop() ?? '';
      const params = new URLSearchParams(searchParams);
      if (previousCursor) params.set('deliveryCursor', previousCursor);
      else params.delete('deliveryCursor');
      setSearchParams(params);
      return nextStack;
    });
  }, [searchParams, setSearchParams]);

  const runStatusChange = async (nextStatus, options) => {
    if (!webhook || webhook.status === nextStatus) return;
    const result = await confirmAction(options);
    if (!result.isConfirmed) return;
    try {
      await updateMutation.mutateAsync({ status: nextStatus });
      notify('Webhook status updated.', 'success');
    } catch (mutationError) {
      notify(getUserFacingMessage(mutationError), 'error');
    }
  };

  const runRotate = async () => {
    if (!webhook) return;
    const result = await confirmAction({
      title: 'Rotate signing secret?',
      text: 'Existing signatures verified with the old secret will fail after rotation.',
      confirmButtonText: 'Rotate',
    });
    if (!result.isConfirmed) return;
    try {
      const rotated = await rotateMutation.mutateAsync(webhook.id);
      setSecretDialog({
        open: true,
        secret: rotated.secret,
        title: 'New signing secret',
        helperText: rotated.subscription.url,
      });
      notify('Webhook secret rotated.', 'success');
    } catch (mutationError) {
      notify(getUserFacingMessage(mutationError), 'error');
    }
  };

  const runDelete = async () => {
    if (!webhook) return;
    const result = await confirmAction({
      title: 'Delete webhook?',
      text: 'The subscription will be marked deleted. Delivery history remains available.',
      confirmButtonText: 'Delete',
    });
    if (!result.isConfirmed) return;
    try {
      await deleteMutation.mutateAsync(webhook.id);
      notify('Webhook deleted.', 'success');
      navigate('/webhooks');
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
        title={error?.httpStatus === 404 ? 'Webhook not found' : 'Unable to load webhook'}
        onRetry={() => refetch()}
      />
    );
  }

  if (!webhook) return null;

  const isDeleted = webhook.status === WEBHOOK_SUBSCRIPTION_STATUS.DELETED;
  const deliveries = deliveryPage?.items ?? [];
  const actionsPending = updateMutation.isPending || deleteMutation.isPending || rotateMutation.isPending;

  return (
    <>
      <Button component={RouterLink} to="/webhooks" startIcon={<ArrowBackIcon />} size="small" sx={{ mb: 2 }}>
        Back to webhooks
      </Button>
      <PageHeader
        title={webhook.description || 'Webhook subscription'}
        description={webhook.url}
        action={
          !isDeleted ? (
            <Box className="flex flex-wrap gap-2">
              <Button component={RouterLink} to={`/webhooks/${webhook.id}/edit`} variant="outlined" size="small">
                Edit
              </Button>
              {webhook.status !== WEBHOOK_SUBSCRIPTION_STATUS.ACTIVE ? (
                <Button
                  variant="outlined"
                  color="success"
                  size="small"
                  disabled={actionsPending}
                  onClick={() =>
                    runStatusChange(WEBHOOK_SUBSCRIPTION_STATUS.ACTIVE, {
                      title: 'Enable webhook?',
                      text: 'Deliveries will resume for this endpoint.',
                      confirmButtonText: 'Enable',
                    })
                  }
                >
                  Enable
                </Button>
              ) : null}
              {webhook.status === WEBHOOK_SUBSCRIPTION_STATUS.ACTIVE ? (
                <Button
                  variant="outlined"
                  color="warning"
                  size="small"
                  disabled={actionsPending}
                  onClick={() =>
                    runStatusChange(WEBHOOK_SUBSCRIPTION_STATUS.DISABLED, {
                      title: 'Disable webhook?',
                      text: 'New deliveries will not be sent until re-enabled.',
                      confirmButtonText: 'Disable',
                    })
                  }
                >
                  Disable
                </Button>
              ) : null}
              <Button variant="outlined" size="small" disabled={actionsPending} onClick={runRotate}>
                Rotate secret
              </Button>
              <Button variant="outlined" color="error" size="small" disabled={actionsPending} onClick={runDelete}>
                Delete
              </Button>
            </Box>
          ) : null
        }
      />
      <Paper className="mb-4 p-4">
        <Typography variant="subtitle2" gutterBottom>
          Subscription
        </Typography>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Endpoint URL
            </Typography>
            <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
              {webhook.url}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Status
            </Typography>
            <StatusBadge status={webhook.status} domain="webhook" />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Event types
            </Typography>
            <Typography variant="body2" fontFamily="monospace" sx={{ wordBreak: 'break-word' }}>
              {webhook.eventTypes.join(', ')}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Created
            </Typography>
            <Typography variant="body2">{formatDate(webhook.createdAt)}</Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Updated
            </Typography>
            <Typography variant="body2">{formatDate(webhook.updatedAt)}</Typography>
          </Grid>
        </Grid>
      </Paper>
      <Paper className="p-4">
        <Box className="mb-3 flex flex-wrap items-end gap-3">
          <Typography variant="subtitle2" className="w-full sm:w-auto sm:flex-1">
            Delivery history
          </Typography>
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel id="delivery-status-filter">Delivery status</InputLabel>
            <Select
              labelId="delivery-status-filter"
              label="Delivery status"
              value={deliveryStatus}
              onChange={(event) => updateDeliveryFilter('deliveryStatus', event.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              {WEBHOOK_DELIVERY_STATUS_OPTIONS.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Event type"
            size="small"
            value={deliveryEventType}
            onChange={(event) => updateDeliveryFilter('deliveryEventType', event.target.value)}
            placeholder="order.created"
            sx={{ minWidth: 200 }}
          />
          <Button size="small" onClick={() => refetchDeliveries()}>
            Refresh
          </Button>
        </Box>
        {deliveries.length === 0 && !deliveriesLoading ? (
          <Typography variant="body2" color="text.secondary">
            No deliveries match your filters yet.
          </Typography>
        ) : (
          <>
            <WebhookDeliveriesTable
              deliveries={deliveries}
              isLoading={deliveriesLoading}
              onSelectDelivery={(deliveryId) => setSelectedDeliveryId(deliveryId)}
            />
            <CursorPagination
              hasMore={Boolean(deliveryPage?.hasMore)}
              hasPrevious={deliveryCursorBackStack.length > 0 || Boolean(deliveryCursor)}
              onNext={goDeliveriesNext}
              onPrevious={goDeliveriesPrevious}
              isLoading={deliveriesLoading}
            />
          </>
        )}
      </Paper>
      <WebhookDeliveryDetailDialog
        open={Boolean(selectedDeliveryId)}
        webhookId={webhookId ?? ''}
        deliveryId={selectedDeliveryId}
        onClose={() => setSelectedDeliveryId(null)}
      />
      <ApiKeySecretDialog
        open={secretDialog.open}
        title={secretDialog.title}
        secret={secretDialog.secret}
        helperText={secretDialog.helperText}
        secretFieldLabel="Signing secret"
        onClose={closeSecretDialog}
      />
    </>
  );
}
