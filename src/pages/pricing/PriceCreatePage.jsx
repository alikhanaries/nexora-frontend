import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/common/PageHeader.jsx';
import { PriceForm } from '../../components/pricing/PriceForm.jsx';
import { useCreatePrice } from '../../hooks/pricing/usePricingMutations.js';
import { useNotification } from '../../hooks/useNotification.js';

export function PriceCreatePage() {
  const navigate = useNavigate();
  const createMutation = useCreatePrice();
  const { notify } = useNotification();

  return (
    <>
      <PageHeader title="New price" description="Create a product price with currency and optional channel scope." />
      <PriceForm
        mode="create"
        isSubmitting={createMutation.isPending}
        onCancel={() => navigate('/pricing')}
        onSubmit={async (values) => {
          const price = await createMutation.mutateAsync(values);
          notify('Price created.', 'success');
          navigate(`/pricing/${price.id}`);
        }}
      />
    </>
  );
}
