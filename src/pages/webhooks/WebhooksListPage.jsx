import Button from '@mui/material/Button';
import { useCallback, useMemo, useState } from 'react';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';
import { PageHeader } from '../../components/common/PageHeader.jsx';
import { CursorPagination } from '../../components/common/CursorPagination.jsx';
import { WebhookFilters } from '../../components/webhooks/WebhookFilters.jsx';
import { WebhooksTable } from '../../components/webhooks/WebhooksTable.jsx';
import { EmptyState } from '../../components/ui/EmptyState.jsx';
import { ErrorState } from '../../components/ui/ErrorState.jsx';
import { DEFAULT_WEBHOOK_LIST_LIMIT } from '../../constants/webhookCatalog.js';
import { useWebhooks } from '../../hooks/webhooks/useWebhookQueries.js';

export function WebhooksListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const status = searchParams.get('status') ?? '';
  const cursor = searchParams.get('cursor') ?? '';
  const [cursorBackStack, setCursorBackStack] = useState(/** @type {string[]} */ ([]));

  const filters = useMemo(
    () => ({
      limit: DEFAULT_WEBHOOK_LIST_LIMIT,
      ...(cursor ? { cursor } : {}),
      ...(status ? { status } : {}),
    }),
    [cursor, status],
  );

  const { data, isLoading, isError, error, refetch } = useWebhooks(filters);

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

  const resetFilters = useCallback(() => {
    setCursorBackStack([]);
    setSearchParams({});
  }, [setSearchParams]);

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

  const webhooks = data?.items ?? [];
  const hasFilters = Boolean(status);

  return (
    <>
      <PageHeader
        title="Webhooks"
        description="Configure HTTPS endpoints that receive signed Nexora integration events."
        action={
          <Button component={RouterLink} to="/webhooks/new" variant="contained" size="small">
            Create webhook
          </Button>
        }
      />
      <WebhookFilters status={status} onChange={updateFilter} onReset={resetFilters} hasFilters={hasFilters} />
      {isError ? (
        <ErrorState
          error={error}
          title={error?.httpStatus === 403 ? 'Access denied' : 'Unable to load webhooks'}
          onRetry={() => refetch()}
        />
      ) : null}
      {!isError && !isLoading && webhooks.length === 0 ? (
        <EmptyState
          title={hasFilters ? 'No webhooks match your filters' : 'No webhooks configured'}
          description={
            hasFilters
              ? 'Adjust filters or create a webhook subscription.'
              : 'Create a webhook to receive order, shipment, and catalog events at your endpoint.'
          }
          action={
            hasFilters ? (
              <Button size="small" onClick={resetFilters}>
                Reset filters
              </Button>
            ) : (
              <Button component={RouterLink} to="/webhooks/new" variant="contained" size="small">
                Create webhook
              </Button>
            )
          }
        />
      ) : null}
      {!isError && (isLoading || webhooks.length > 0) ? (
        <>
          <WebhooksTable webhooks={webhooks} isLoading={isLoading} />
          <CursorPagination
            hasMore={Boolean(data?.hasMore)}
            hasPrevious={cursorBackStack.length > 0 || Boolean(cursor)}
            onNext={goNext}
            onPrevious={goPrevious}
            isLoading={isLoading}
          />
        </>
      ) : null}
    </>
  );
}
