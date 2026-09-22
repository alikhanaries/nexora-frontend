import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import { useNavigate, useParams } from 'react-router-dom';
import { PageHeader } from '../../components/common/PageHeader.jsx';
import { OfferForm } from '../../components/offers/OfferForm.jsx';
import { OFFER_STATUS } from '../../constants/offerCatalog.js';
import { useUpdateOffer } from '../../hooks/offers/useOfferMutations.js';
import { useOffer } from '../../hooks/offers/useOfferQueries.js';
import { useNotification } from '../../hooks/useNotification.js';
import { ErrorState } from '../../components/ui/ErrorState.jsx';

export function OfferEditPage() {
  const { offerId } = useParams();
  const navigate = useNavigate();
  const { data: offer, isLoading, isError, error, refetch } = useOffer(offerId);
  const updateMutation = useUpdateOffer(offerId);
  const { notify } = useNotification();

  if (isLoading) {
    return (
      <Box className="flex flex-col gap-4">
        <Skeleton variant="text" width={200} height={40} />
        <Skeleton variant="rounded" height={240} />
      </Box>
    );
  }

  if (isError) {
    return (
      <ErrorState
        error={error}
        title={error?.httpStatus === 404 ? 'Offer not found' : 'Unable to load offer'}
        onRetry={() => refetch()}
      />
    );
  }

  if (!offer) return null;

  if (offer.status === OFFER_STATUS.INACTIVE) {
    return (
      <>
        <PageHeader title="Edit offer" description="This offer is inactive and cannot be updated." />
        <Alert severity="info" variant="outlined">
          Inactive offers cannot be edited per backend rules. View the offer or create a new one for the same product
          and channel if needed.
        </Alert>
      </>
    );
  }

  return (
    <>
      <PageHeader title="Edit offer" description={`Offer ${offer.id}`} />
      <OfferForm
        mode="edit"
        initialValues={{
          externalReference: offer.externalReference,
          priceReference: offer.priceReference,
          listingStatus: offer.listingStatus,
        }}
        isSubmitting={updateMutation.isPending}
        onCancel={() => navigate(`/offers/${offer.id}`)}
        onSubmit={async (values) => {
          await updateMutation.mutateAsync(values);
          notify('Offer updated.', 'success');
          navigate(`/offers/${offer.id}`);
        }}
      />
    </>
  );
}
