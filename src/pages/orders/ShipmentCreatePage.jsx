import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Skeleton from '@mui/material/Skeleton';
import { useRef } from 'react';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import { PageHeader } from '../../components/common/PageHeader.jsx';
import { ShipmentForm } from '../../components/shipments/ShipmentForm.jsx';
import { useCreateShipment } from '../../hooks/shipments/useShipmentMutations.js';
import { useOrder } from '../../hooks/orders/useOrderQueries.js';
import { useNotification } from '../../hooks/useNotification.js';
import { ErrorState } from '../../components/ui/ErrorState.jsx';
import { getUserFacingMessage } from '../../services/api/apiError.js';

export function ShipmentCreatePage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { data: order, isLoading, isError, error, refetch } = useOrder(orderId);
  const createMutation = useCreateShipment(orderId);
  const { notify } = useNotification();
  const idempotencyKeyRef = useRef(crypto.randomUUID());

  if (isLoading) {
    return <Skeleton variant="rounded" height={320} />;
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

  return (
    <>
      <Button
        component={RouterLink}
        to={`/orders/${orderId}`}
        startIcon={<ArrowBackIcon />}
        size="small"
        sx={{ mb: 2 }}
      >
        Back to order
      </Button>
      <PageHeader
        title="Create shipment"
        description={`Order ${order.orderNumber} — select lines and quantities to ship.`}
      />
      {!order.lines?.length ? (
        <Alert severity="warning" variant="outlined">
          This order has no lines. Add order lines before creating a shipment.
        </Alert>
      ) : (
        <ShipmentForm
          orderLines={order.lines}
          idempotencyKey={idempotencyKeyRef.current}
          isSubmitting={createMutation.isPending}
          onCancel={() => navigate(`/orders/${orderId}`)}
          onSubmit={async ({ body, idempotencyKey }) => {
            try {
              const shipment = await createMutation.mutateAsync({ body, idempotencyKey });
              notify('Shipment created.', 'success');
              navigate(`/shipments/${shipment.id}`);
            } catch (createError) {
              if (createError?.httpStatus === 409) {
                notify(getUserFacingMessage(createError), 'error');
              }
              throw createError;
            }
          }}
        />
      )}
    </>
  );
}
