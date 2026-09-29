import { useNavigate, useParams } from 'react-router-dom';
import { PageHeader } from '../../components/common/PageHeader.jsx';
import { MarketplaceForm } from '../../components/marketplaces/MarketplaceForm.jsx';
import { useUpdateMarketplace } from '../../hooks/marketplaces/useMarketplaceMutations.js';
import { useMarketplace } from '../../hooks/marketplaces/useMarketplaceQueries.js';
import { useNotification } from '../../hooks/useNotification.js';
import { ErrorState } from '../../components/ui/ErrorState.jsx';
import { LoadingScreen } from '../../components/ui/LoadingScreen.jsx';

export function MarketplaceEditPage() {
  const { marketplaceId } = useParams();
  const navigate = useNavigate();
  const { data: marketplace, isLoading, isError, error, refetch } = useMarketplace(marketplaceId);
  const updateMutation = useUpdateMarketplace(marketplaceId);
  const { notify } = useNotification();

  if (isLoading) {
    return <LoadingScreen message="Loading marketplace…" />;
  }

  if (isError) {
    return (
      <ErrorState
        error={error}
        title={error?.httpStatus === 404 ? 'Marketplace not found' : 'Unable to load marketplace'}
        onRetry={() => refetch()}
      />
    );
  }

  if (!marketplace) {
    return null;
  }

  return (
    <>
      <PageHeader title="Edit marketplace" description={marketplace.name} />
      <MarketplaceForm
        mode="edit"
        initialValues={{ key: marketplace.key, name: marketplace.name }}
        isSubmitting={updateMutation.isPending}
        onCancel={() => navigate(`/marketplaces/${marketplace.id}`)}
        onSubmit={async (values) => {
          await updateMutation.mutateAsync(values);
          notify('Marketplace updated.', 'success');
          navigate(`/marketplaces/${marketplace.id}`);
        }}
      />
    </>
  );
}
