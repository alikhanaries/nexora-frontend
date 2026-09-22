import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import { useCallback, useMemo, useState } from 'react';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';
import { PageHeader } from '../../components/common/PageHeader.jsx';
import { CursorPagination } from '../../components/common/CursorPagination.jsx';
import { OfferFilters } from '../../components/offers/OfferFilters.jsx';
import { OffersTable } from '../../components/offers/OffersTable.jsx';
import { EmptyState } from '../../components/ui/EmptyState.jsx';
import { ErrorState } from '../../components/ui/ErrorState.jsx';
import { DEFAULT_OFFER_LIST_LIMIT } from '../../constants/offerCatalog.js';
import { useChannels } from '../../hooks/channels/useChannelQueries.js';
import {
  useActivateOffer,
  useDeactivateOffer,
  useSuspendOffer,
} from '../../hooks/offers/useOfferMutations.js';
import { useOffers } from '../../hooks/offers/useOfferQueries.js';
import { useNotification } from '../../hooks/useNotification.js';
import { getUserFacingMessage } from '../../services/api/apiError.js';
import { buildChannelNameById } from '../../utils/channelLabel.js';
import {
  confirmOfferActivation,
  confirmOfferDeactivation,
  confirmOfferSuspend,
} from '../../utils/offerActivateDialog.js';

export function OffersListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const productId = searchParams.get('productId') ?? '';
  const channelId = searchParams.get('channelId') ?? '';
  const status = searchParams.get('status') ?? '';
  const cursor = searchParams.get('cursor') ?? '';
  const [cursorBackStack, setCursorBackStack] = useState(/** @type {string[]} */ ([]));

  const filters = useMemo(
    () => ({
      limit: DEFAULT_OFFER_LIST_LIMIT,
      ...(cursor ? { cursor } : {}),
      ...(productId ? { productId } : {}),
      ...(channelId ? { channelId } : {}),
      ...(status ? { status } : {}),
    }),
    [cursor, productId, channelId, status],
  );

  const { data, isLoading, isFetching, isError, error, refetch } = useOffers(filters);
  const { data: channels } = useChannels();
  const channelNameById = useMemo(() => buildChannelNameById(channels), [channels]);

  const activateMutation = useActivateOffer();
  const deactivateMutation = useDeactivateOffer();
  const suspendMutation = useSuspendOffer();
  const { notify } = useNotification();

  const updateFilter = useCallback(
    (field, value) => {
      setCursorBackStack([]);
      const params = new URLSearchParams(searchParams);
      if (value) params.set(field, value);
      else params.delete(field);
      params.delete('cursor');
      setSearchParams(params);
    },
    [searchParams, setSearchParams],
  );

  const goNext = useCallback(() => {
    if (!data?.nextCursor) return;
    setCursorBackStack((prev) => [...prev, cursor]);
    const params = new URLSearchParams(searchParams);
    params.set('cursor', data.nextCursor);
    setSearchParams(params);
  }, [cursor, data?.nextCursor, searchParams, setSearchParams]);

  const goPrevious = useCallback(() => {
    setCursorBackStack((prev) => {
      const nextStack = [...prev];
      const previousCursor = nextStack.pop() ?? '';
      const params = new URLSearchParams(searchParams);
      if (previousCursor) params.set('cursor', previousCursor);
      else params.delete('cursor');
      setSearchParams(params);
      return nextStack;
    });
  }, [searchParams, setSearchParams]);

  const channelLabel = (offer) => channelNameById[offer.channelId];

  const handleActivate = async (offer) => {
    const result = await confirmOfferActivation({
      productId: offer.productId,
      channelId: offer.channelId,
      channelLabel: channelLabel(offer),
    });
    if (!result.confirmed) return;
    try {
      await activateMutation.mutateAsync({ offerId: offer.id, body: result.body });
      notify('Offer activated.', 'success');
    } catch (mutationError) {
      notify(getUserFacingMessage(mutationError), 'error');
    }
  };

  const handleSuspend = async (offer) => {
    const result = await confirmOfferSuspend(offer, channelLabel(offer));
    if (!result.isConfirmed) return;
    try {
      await suspendMutation.mutateAsync(offer.id);
      notify('Offer suspended.', 'success');
    } catch (mutationError) {
      notify(getUserFacingMessage(mutationError), 'error');
    }
  };

  const handleDeactivate = async (offer) => {
    const result = await confirmOfferDeactivation(offer, channelLabel(offer));
    if (!result.isConfirmed) return;
    try {
      await deactivateMutation.mutateAsync(offer.id);
      notify('Offer deactivated.', 'success');
    } catch (mutationError) {
      notify(getUserFacingMessage(mutationError), 'error');
    }
  };

  const offers = data?.items ?? [];
  const hasFilters = Boolean(productId || channelId || status);

  return (
    <>
      <PageHeader
        title="Offers"
        description="Channel offers linking products to sales channels."
        action={
          <Button component={RouterLink} to="/offers/new" variant="contained" startIcon={<AddIcon />}>
            New offer
          </Button>
        }
      />
      <OfferFilters productId={productId} channelId={channelId} status={status} onChange={updateFilter} />
      {isError ? <ErrorState error={error} onRetry={() => refetch()} /> : null}
      {!isError && !isLoading && offers.length === 0 ? (
        <EmptyState
          title={hasFilters ? 'No offers match your filters' : 'No offers yet'}
          description={
            hasFilters
              ? 'Adjust filters or create a new offer.'
              : 'Create an offer to list a product on a channel.'
          }
          action={
            !hasFilters ? (
              <Button component={RouterLink} to="/offers/new" variant="contained" size="small">
                Create offer
              </Button>
            ) : null
          }
        />
      ) : null}
      {!isError && (isLoading || offers.length > 0) ? (
        <>
          <OffersTable
            offers={offers}
            isLoading={isLoading}
            channelNameById={channelNameById}
            onActivate={handleActivate}
            onSuspend={handleSuspend}
            onDeactivate={handleDeactivate}
          />
          <CursorPagination
            hasMore={Boolean(data?.hasMore)}
            canGoBack={cursorBackStack.length > 0 || Boolean(cursor)}
            onNext={goNext}
            onPrevious={goPrevious}
            isLoading={isFetching}
            itemCount={offers.length}
          />
        </>
      ) : null}
    </>
  );
}
