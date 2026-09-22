import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import { useCallback, useMemo, useState } from 'react';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';
import { PageHeader } from '../../components/common/PageHeader.jsx';
import { CursorPagination } from '../../components/common/CursorPagination.jsx';
import { PriceFilters } from '../../components/pricing/PriceFilters.jsx';
import { PricingTable } from '../../components/pricing/PricingTable.jsx';
import { EmptyState } from '../../components/ui/EmptyState.jsx';
import { ErrorState } from '../../components/ui/ErrorState.jsx';
import { DEFAULT_PRICE_LIST_LIMIT } from '../../constants/priceCatalog.js';
import { useDeactivatePrice } from '../../hooks/pricing/usePricingMutations.js';
import { usePrices } from '../../hooks/pricing/usePricingQueries.js';
import { useNotification } from '../../hooks/useNotification.js';
import { confirmAction } from '../../utils/confirmDialog.js';
import { formatMoneyMinor } from '../../utils/money.js';

export function PricingListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const productId = searchParams.get('productId') ?? '';
  const channelId = searchParams.get('channelId') ?? '';
  const currency = searchParams.get('currency') ?? '';
  const status = searchParams.get('status') ?? '';
  const cursor = searchParams.get('cursor') ?? '';
  const [cursorBackStack, setCursorBackStack] = useState(/** @type {string[]} */ ([]));

  const filters = useMemo(
    () => ({
      limit: DEFAULT_PRICE_LIST_LIMIT,
      ...(cursor ? { cursor } : {}),
      ...(productId ? { productId } : {}),
      ...(channelId ? { channelId } : {}),
      ...(currency ? { currency } : {}),
      ...(status ? { status } : {}),
    }),
    [cursor, productId, channelId, currency, status],
  );

  const { data, isLoading, isFetching, isError, error, refetch } = usePrices(filters);
  const deactivateMutation = useDeactivatePrice();
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

  const handleDeactivate = async (price) => {
    const result = await confirmAction({
      title: 'Deactivate price?',
      text: `Deactivate ${formatMoneyMinor(price.amountMinor, price.currency)} for product ${price.productId}?`,
      confirmButtonText: 'Deactivate',
    });
    if (!result.isConfirmed) return;
    await deactivateMutation.mutateAsync(price.id);
    notify('Price deactivated.', 'success');
  };

  const prices = data?.items ?? [];
  const hasFilters = Boolean(productId || channelId || currency || status);

  return (
    <>
      <PageHeader
        title="Pricing"
        description="Product prices with currency and optional channel scope."
        action={
          <Button component={RouterLink} to="/pricing/new" variant="contained" startIcon={<AddIcon />}>
            New price
          </Button>
        }
      />
      <PriceFilters
        productId={productId}
        channelId={channelId}
        currency={currency}
        status={status}
        onChange={updateFilter}
      />
      {isError ? <ErrorState error={error} onRetry={() => refetch()} /> : null}
      {!isError && !isLoading && prices.length === 0 ? (
        <EmptyState
          title={hasFilters ? 'No prices match your filters' : 'No prices yet'}
          description={
            hasFilters
              ? 'Adjust filters or create a new price.'
              : 'Create a price record for a product in your catalog.'
          }
          action={
            !hasFilters ? (
              <Button component={RouterLink} to="/pricing/new" variant="contained" size="small">
                Create price
              </Button>
            ) : null
          }
        />
      ) : null}
      {!isError && (isLoading || prices.length > 0) ? (
        <>
          <PricingTable prices={prices} isLoading={isLoading} onDeactivate={handleDeactivate} />
          <CursorPagination
            hasMore={Boolean(data?.hasMore)}
            canGoBack={cursorBackStack.length > 0 || Boolean(cursor)}
            onNext={goNext}
            onPrevious={goPrevious}
            isLoading={isFetching}
            itemCount={prices.length}
          />
        </>
      ) : null}
    </>
  );
}
