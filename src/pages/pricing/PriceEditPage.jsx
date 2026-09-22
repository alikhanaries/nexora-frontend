import { useNavigate, useParams } from 'react-router-dom';
import { PageHeader } from '../../components/common/PageHeader.jsx';
import { PriceForm } from '../../components/pricing/PriceForm.jsx';
import { useUpdatePrice } from '../../hooks/pricing/usePricingMutations.js';
import { usePrice } from '../../hooks/pricing/usePricingQueries.js';
import { useNotification } from '../../hooks/useNotification.js';
import { ErrorState } from '../../components/ui/ErrorState.jsx';
import { LoadingScreen } from '../../components/ui/LoadingScreen.jsx';

export function PriceEditPage() {
  const { priceId } = useParams();
  const navigate = useNavigate();
  const { data: price, isLoading, isError, error, refetch } = usePrice(priceId);
  const updateMutation = useUpdatePrice(priceId);
  const { notify } = useNotification();

  if (isLoading) return <LoadingScreen message="Loading price…" />;

  if (isError) {
    return (
      <ErrorState
        error={error}
        title={error?.httpStatus === 404 ? 'Price not found' : 'Unable to load price'}
        onRetry={() => refetch()}
      />
    );
  }

  if (!price) return null;

  return (
    <>
      <PageHeader title="Edit price" description={price.id} />
      <PriceForm
        mode="edit"
        initialValues={{
          productId: price.productId,
          currency: price.currency,
          amountMinor: price.amountMinor,
          channelId: price.channelId,
          validFrom: price.validFrom,
          validTo: price.validTo,
        }}
        isSubmitting={updateMutation.isPending}
        onCancel={() => navigate(`/pricing/${price.id}`)}
        onSubmit={async (values) => {
          await updateMutation.mutateAsync(values);
          notify('Price updated.', 'success');
          navigate(`/pricing/${price.id}`);
        }}
      />
    </>
  );
}
