import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/common/PageHeader.jsx';
import { MarketplaceForm } from '../../components/marketplaces/MarketplaceForm.jsx';
import { useCreateMarketplace } from '../../hooks/marketplaces/useMarketplaceMutations.js';
import { useNotification } from '../../hooks/useNotification.js';

export function MarketplaceCreatePage() {
  const navigate = useNavigate();
  const createMutation = useCreateMarketplace();
  const { notify } = useNotification();

  return (
    <>
      <PageHeader title="New marketplace" description="Add a global marketplace definition." />
      <MarketplaceForm
        mode="create"
        isSubmitting={createMutation.isPending}
        onCancel={() => navigate('/marketplaces')}
        onSubmit={async (values) => {
          const marketplace = await createMutation.mutateAsync(values);
          notify('Marketplace created.', 'success');
          navigate(`/marketplaces/${marketplace.id}`);
        }}
      />
    </>
  );
}
