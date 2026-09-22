import Button from '@mui/material/Button';
import { useCallback, useMemo, useState } from 'react';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';
import { PageHeader } from '../../components/common/PageHeader.jsx';
import { CursorPagination } from '../../components/common/CursorPagination.jsx';
import { ShipmentFilters } from '../../components/shipments/ShipmentFilters.jsx';
import { ShipmentsTable } from '../../components/shipments/ShipmentsTable.jsx';
import { EmptyState } from '../../components/ui/EmptyState.jsx';
import { ErrorState } from '../../components/ui/ErrorState.jsx';
import { DEFAULT_SHIPMENT_LIST_LIMIT } from '../../constants/shipmentCatalog.js';
import { useShipments } from '../../hooks/shipments/useShipmentQueries.js';

export function ShipmentsListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const status = searchParams.get('status') ?? '';
  const orderId = searchParams.get('orderId') ?? '';
  const trackingNumber = searchParams.get('trackingNumber') ?? '';
  const cursor = searchParams.get('cursor') ?? '';
  const [cursorBackStack, setCursorBackStack] = useState(/** @type {string[]} */ ([]));

  const filters = useMemo(
    () => ({
      limit: DEFAULT_SHIPMENT_LIST_LIMIT,
      ...(cursor ? { cursor } : {}),
      ...(status ? { status } : {}),
      ...(orderId ? { orderId } : {}),
      ...(trackingNumber ? { trackingNumber } : {}),
    }),
    [cursor, status, orderId, trackingNumber],
  );

  const { data, isLoading, isFetching, isError, error, refetch } = useShipments(filters);

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

  const shipments = data?.items ?? [];
  const hasFilters = Boolean(status || orderId || trackingNumber);

  return (
    <>
      <PageHeader title="Shipments" description="Fulfillment shipments linked to orders." />
      <ShipmentFilters
        status={status}
        orderId={orderId}
        trackingNumber={trackingNumber}
        onChange={updateFilter}
      />
      {isError ? <ErrorState error={error} onRetry={() => refetch()} /> : null}
      {!isError && !isLoading && shipments.length === 0 ? (
        <EmptyState
          title={hasFilters ? 'No shipments match your filters' : 'No shipments yet'}
          description={
            hasFilters
              ? 'Adjust filters or create a shipment from an order detail page.'
              : 'Open an order and create a shipment when lines are ready to ship.'
          }
          action={
            orderId ? (
              <Button component={RouterLink} to={`/orders/${orderId}/shipments/new`} variant="contained" size="small">
                Create shipment
              </Button>
            ) : null
          }
        />
      ) : null}
      {!isError && (isLoading || shipments.length > 0) ? (
        <>
          <ShipmentsTable shipments={shipments} isLoading={isLoading} />
          <CursorPagination
            hasMore={Boolean(data?.hasMore)}
            canGoBack={cursorBackStack.length > 0 || Boolean(cursor)}
            onNext={goNext}
            onPrevious={goPrevious}
            isLoading={isFetching}
            itemCount={shipments.length}
          />
        </>
      ) : null}
    </>
  );
}
