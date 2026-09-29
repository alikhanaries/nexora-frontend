import { useCallback, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CancellationFilters } from '../../components/cancellations/CancellationFilters.jsx';
import { CancellationsTable } from '../../components/cancellations/CancellationsTable.jsx';
import { PageHeader } from '../../components/common/PageHeader.jsx';
import { CursorPagination } from '../../components/common/CursorPagination.jsx';
import { EmptyState } from '../../components/ui/EmptyState.jsx';
import { ErrorState } from '../../components/ui/ErrorState.jsx';
import {
  CANCELLATION_STATUS_OPTIONS,
  DEFAULT_CANCELLATION_LIST_LIMIT,
} from '../../constants/cancellationCatalog.js';
import { useCancellations } from '../../hooks/cancellations/useCancellationQueries.js';

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function parseStatus(raw) {
  if (!raw) return '';
  return CANCELLATION_STATUS_OPTIONS.includes(raw) ? raw : '';
}

function parseOrderId(raw) {
  if (!raw?.trim()) return '';
  const trimmed = raw.trim();
  return UUID_PATTERN.test(trimmed) ? trimmed : '';
}

export function CancellationsListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const status = parseStatus(searchParams.get('status') ?? '');
  const orderIdRaw = searchParams.get('orderId') ?? '';
  const orderId = parseOrderId(orderIdRaw);
  const cursor = searchParams.get('cursor') ?? '';
  const [cursorBackStack, setCursorBackStack] = useState(/** @type {string[]} */ ([]));

  const filters = useMemo(
    () => ({
      limit: DEFAULT_CANCELLATION_LIST_LIMIT,
      ...(cursor ? { cursor } : {}),
      ...(status ? { status } : {}),
      ...(orderId ? { orderId } : {}),
    }),
    [cursor, status, orderId],
  );

  const { data, isLoading, isFetching, isError, error, refetch } = useCancellations(filters);

  const updateFilter = useCallback(
    (field, value) => {
      setCursorBackStack([]);
      const params = new URLSearchParams(searchParams);
      if (field === 'orderId') {
        const parsed = parseOrderId(value);
        if (parsed) params.set('orderId', parsed);
        else params.delete('orderId');
      } else if (field === 'status') {
        const parsed = parseStatus(value);
        if (parsed) params.set('status', parsed);
        else params.delete('status');
      } else if (value) {
        params.set(field, value);
      } else {
        params.delete(field);
      }
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

  const cancellations = data?.items ?? [];
  const hasFilters = Boolean(status || orderId);
  const orderIdFilterInvalid = Boolean(orderIdRaw.trim()) && !orderId;

  return (
    <>
      <PageHeader
        title="Cancellations"
        description="Order cancellation records for your tenant. Create cancellations from an order detail page."
      />
      <CancellationFilters
        status={status}
        orderId={orderIdRaw}
        onChange={updateFilter}
      />
      {orderIdFilterInvalid ? (
        <EmptyState
          title="Invalid order ID filter"
          description="Enter a valid order UUID or clear the filter."
        />
      ) : null}
      {!orderIdFilterInvalid && isError ? <ErrorState error={error} onRetry={() => refetch()} /> : null}
      {!orderIdFilterInvalid && !isError && !isLoading && cancellations.length === 0 ? (
        <EmptyState
          title={hasFilters ? 'No cancellations match your filters' : 'No cancellations yet'}
          description={
            hasFilters
              ? 'Adjust filters or cancel an order from its detail page when quantity remains cancellable.'
              : 'Open an order in a cancellable status and use Cancel order when lines still have remaining quantity.'
          }
        />
      ) : null}
      {!orderIdFilterInvalid && !isError && (isLoading || cancellations.length > 0) ? (
        <>
          <CancellationsTable cancellations={cancellations} isLoading={isLoading} />
          <CursorPagination
            hasMore={Boolean(data?.hasMore)}
            canGoBack={cursorBackStack.length > 0 || Boolean(cursor)}
            onNext={goNext}
            onPrevious={goPrevious}
            isLoading={isFetching}
            itemCount={cancellations.length}
          />
        </>
      ) : null}
    </>
  );
}
