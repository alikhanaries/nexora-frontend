import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import { useCallback, useMemo, useState } from 'react';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';
import { PageHeader } from '../../components/common/PageHeader.jsx';
import { CursorPagination } from '../../components/common/CursorPagination.jsx';
import { OrderFilters } from '../../components/orders/OrderFilters.jsx';
import { OrdersTable } from '../../components/orders/OrdersTable.jsx';
import { EmptyState } from '../../components/ui/EmptyState.jsx';
import { ErrorState } from '../../components/ui/ErrorState.jsx';
import { DEFAULT_ORDER_LIST_LIMIT } from '../../constants/orderCatalog.js';
import { useChannels } from '../../hooks/channels/useChannelQueries.js';
import { useOrders } from '../../hooks/orders/useOrderQueries.js';
import { buildChannelNameById } from '../../utils/channelLabel.js';

export function OrdersListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const status = searchParams.get('status') ?? '';
  const channelId = searchParams.get('channelId') ?? '';
  const externalOrderReference = searchParams.get('externalOrderReference') ?? '';
  const orderNumber = searchParams.get('orderNumber') ?? '';
  const createdAfter = searchParams.get('createdAfter') ?? '';
  const createdBefore = searchParams.get('createdBefore') ?? '';
  const cursor = searchParams.get('cursor') ?? '';
  const [cursorBackStack, setCursorBackStack] = useState(/** @type {string[]} */ ([]));

  const filters = useMemo(
    () => ({
      limit: DEFAULT_ORDER_LIST_LIMIT,
      ...(cursor ? { cursor } : {}),
      ...(status ? { status } : {}),
      ...(channelId ? { channelId } : {}),
      ...(externalOrderReference ? { externalOrderReference } : {}),
      ...(orderNumber ? { orderNumber } : {}),
      ...(createdAfter ? { createdAfter } : {}),
      ...(createdBefore ? { createdBefore } : {}),
    }),
    [cursor, status, channelId, externalOrderReference, orderNumber, createdAfter, createdBefore],
  );

  const { data, isLoading, isFetching, isError, error, refetch } = useOrders(filters);
  const { data: channels } = useChannels();
  const channelNameById = useMemo(() => buildChannelNameById(channels), [channels]);

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

  const orders = data?.items ?? [];
  const hasFilters = Boolean(
    status || channelId || externalOrderReference || orderNumber || createdAfter || createdBefore,
  );

  return (
    <>
      <PageHeader
        title="Orders"
        description="Sales orders with channel scope and line-level fulfillment references."
        action={
          <Button component={RouterLink} to="/orders/new" variant="contained" startIcon={<AddIcon />}>
            New order
          </Button>
        }
      />
      <OrderFilters
        status={status}
        channelId={channelId}
        externalOrderReference={externalOrderReference}
        orderNumber={orderNumber}
        createdAfter={createdAfter}
        createdBefore={createdBefore}
        onChange={updateFilter}
      />
      {isError ? <ErrorState error={error} onRetry={() => refetch()} /> : null}
      {!isError && !isLoading && orders.length === 0 ? (
        <EmptyState
          title={hasFilters ? 'No orders match your filters' : 'No orders yet'}
          description={
            hasFilters ? 'Adjust filters or create a new order.' : 'Create an order to start the fulfillment workflow.'
          }
          action={
            !hasFilters ? (
              <Button component={RouterLink} to="/orders/new" variant="contained" size="small">
                Create order
              </Button>
            ) : null
          }
        />
      ) : null}
      {!isError && (isLoading || orders.length > 0) ? (
        <>
          <OrdersTable orders={orders} isLoading={isLoading} channelNameById={channelNameById} />
          <CursorPagination
            hasMore={Boolean(data?.hasMore)}
            canGoBack={cursorBackStack.length > 0 || Boolean(cursor)}
            onNext={goNext}
            onPrevious={goPrevious}
            isLoading={isFetching}
            itemCount={orders.length}
          />
        </>
      ) : null}
    </>
  );
}
