import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { CancellationCreateForm } from '../../components/cancellations/CancellationCreateForm.jsx';
import { PageHeader } from '../../components/common/PageHeader.jsx';
import { useCreateCancellation } from '../../hooks/cancellations/useCancellationMutations.js';
import { useNotification } from '../../hooks/useNotification.js';

export function CancellationCreatePage() {
  const navigate = useNavigate();
  const createMutation = useCreateCancellation();
  const { notify } = useNotification();
  const idempotencyKeyRef = useRef(crypto.randomUUID());

  return (
    <>
      <PageHeader
        title="Request cancellation"
        description="POST /cancellations for an order. Line-level quantities can be added when the API form supports them."
      />
      <CancellationCreateForm
        idempotencyKey={idempotencyKeyRef.current}
        isSubmitting={createMutation.isPending}
        onCancel={() => navigate('/cancellations')}
        onSubmit={async ({ body, idempotencyKey }) => {
          const cancellation = await createMutation.mutateAsync({ body, idempotencyKey });
          notify('Cancellation requested.', 'success');
          navigate(`/cancellations/${cancellation.id}`);
        }}
      />
    </>
  );
}
