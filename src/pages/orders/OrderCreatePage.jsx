import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/common/PageHeader.jsx';
import { OrderForm } from '../../components/orders/OrderForm.jsx';
import { useCreateOrder } from '../../hooks/orders/useOrderMutations.js';
import { useNotification } from '../../hooks/useNotification.js';
import { getUserFacingMessage } from '../../services/api/apiError.js';

export function OrderCreatePage() {
  const navigate = useNavigate();
  const createMutation = useCreateOrder();
  const { notify } = useNotification();
  const idempotencyKeyRef = useRef(crypto.randomUUID());

  return (
    <>
      <PageHeader
        title="New order"
        description="Create a sales order. A fixed idempotency key is used for this page visit to avoid duplicate orders on retry."
      />
      <OrderForm
        idempotencyKey={idempotencyKeyRef.current}
        isSubmitting={createMutation.isPending}
        onCancel={() => navigate('/orders')}
        onSubmit={async ({ body, idempotencyKey }) => {
          try {
            const order = await createMutation.mutateAsync({ body, idempotencyKey });
            notify('Order created.', 'success');
            navigate(`/orders/${order.id}`);
          } catch (error) {
            if (error?.httpStatus === 409) {
              notify(getUserFacingMessage(error), 'error');
            }
            throw error;
          }
        }}
      />
    </>
  );
}
