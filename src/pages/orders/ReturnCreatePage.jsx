import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Skeleton from '@mui/material/Skeleton';
import { useRef } from 'react';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import { PageHeader } from '../../components/common/PageHeader.jsx';
import { ReturnForm } from '../../components/returns/ReturnForm.jsx';
import { useCreateReturn } from '../../hooks/returns/useReturnMutations.js';
import { useOrder } from '../../hooks/orders/useOrderQueries.js';
import { useNotification } from '../../hooks/useNotification.js';
import { ErrorState } from '../../components/ui/ErrorState.jsx';
import { getUserFacingMessage } from '../../services/api/apiError.js';

export function ReturnCreatePage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { data: order, isLoading, isError, error, refetch } = useOrder(orderId);
  const createMutation = useCreateReturn(orderId);
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
      <Button component={RouterLink} to={`/orders/${orderId}`} startIcon={<ArrowBackIcon />} size="small" sx={{ mb: 2 }}>
        Back to order
      </Button>
      <PageHeader title="Create return" description={`Order ${order.orderNumber}`} />
      {!order.lines?.length ? (
        <Alert severity="warning" variant="outlined">
          This order has no lines to return.
        </Alert>
      ) : (
        <ReturnForm
          orderId={orderId}
          orderLines={order.lines}
          idempotencyKey={idempotencyKeyRef.current}
          isSubmitting={createMutation.isPending}
          onCancel={() => navigate(`/orders/${orderId}`)}
          onSubmit={async ({ body, idempotencyKey }) => {
            try {
              const created = await createMutation.mutateAsync({ body, idempotencyKey });
              notify('Return created.', 'success');
              navigate(`/returns/${created.id}`);
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
