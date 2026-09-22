import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/common/PageHeader.jsx';
import { OfferForm } from '../../components/offers/OfferForm.jsx';
import { useCreateOffer } from '../../hooks/offers/useOfferMutations.js';
import { useNotification } from '../../hooks/useNotification.js';
import { getUserFacingMessage } from '../../services/api/apiError.js';

export function OfferCreatePage() {
  const navigate = useNavigate();
  const createMutation = useCreateOffer();
  const { notify } = useNotification();

  return (
    <>
      <PageHeader
        title="New offer"
        description="Link a product to a channel. One offer per product and channel pair."
      />
      <OfferForm
        mode="create"
        isSubmitting={createMutation.isPending}
        onCancel={() => navigate('/offers')}
        onSubmit={async (values) => {
          try {
            const offer = await createMutation.mutateAsync(values);
            notify('Offer created.', 'success');
            navigate(`/offers/${offer.id}`);
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
