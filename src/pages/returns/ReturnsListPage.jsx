import Button from '@mui/material/Button';
import { useCallback, useMemo, useState } from 'react';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';
import { PageHeader } from '../../components/common/PageHeader.jsx';
import { CursorPagination } from '../../components/common/CursorPagination.jsx';
import { ReturnFilters } from '../../components/returns/ReturnFilters.jsx';
import { ReturnsTable } from '../../components/returns/ReturnsTable.jsx';
import { EmptyState } from '../../components/ui/EmptyState.jsx';
import { ErrorState } from '../../components/ui/ErrorState.jsx';
import { DEFAULT_RETURN_LIST_LIMIT } from '../../constants/returnCatalog.js';
import { useReturns } from '../../hooks/returns/useReturnQueries.js';

export function ReturnsListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const status = searchParams.get('status') ?? '';
  const orderId = searchParams.get('orderId') ?? '';
  const cursor = searchParams.get('cursor') ?? '';
  const [cursorBackStack, setCursorBackStack] = useState(/** @type {string[]} */ ([]));

  const filters = useMemo(
    () => ({
      limit: DEFAULT_RETURN_LIST_LIMIT,
      ...(cursor ? { cursor } : {}),
      ...(status ? { status } : {}),
      ...(orderId ? { orderId } : {}),
    }),
    [cursor, status, orderId],
  );

  const { data, isLoading, isFetching, isError, error, refetch } = useReturns(filters);

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

  const items = data?.items ?? [];
  const hasFilters = Boolean(status || orderId);

  return (
    <>
      <PageHeader title="Returns" description="Return requests linked to orders and optional shipments." />
      <ReturnFilters status={status} orderId={orderId} onChange={updateFilter} />
      {isError ? <ErrorState error={error} onRetry={() => refetch()} /> : null}
      {!isError && !isLoading && items.length === 0 ? (
        <EmptyState
          title={hasFilters ? 'No returns match your filters' : 'No returns yet'}
          description={
            hasFilters
              ? 'Adjust filters or create a return from an order.'
              : 'Open an order and create a return request when needed.'
          }
          action={
            orderId ? (
              <Button component={RouterLink} to={`/orders/${orderId}/returns/new`} variant="contained" size="small">
                Create return
              </Button>
            ) : null
          }
        />
      ) : null}
      {!isError && (isLoading || items.length > 0) ? (
        <>
          <ReturnsTable returns={items} isLoading={isLoading} />
          <CursorPagination
            hasMore={Boolean(data?.hasMore)}
            canGoBack={cursorBackStack.length > 0 || Boolean(cursor)}
            onNext={goNext}
            onPrevious={goPrevious}
            isLoading={isFetching}
            itemCount={items.length}
          />
        </>
      ) : null}
    </>
  );
}
