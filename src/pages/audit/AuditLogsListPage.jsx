import Button from '@mui/material/Button';
import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PageHeader } from '../../components/common/PageHeader.jsx';
import { OffsetPagination } from '../../components/common/OffsetPagination.jsx';
import { AuditEventsTable } from '../../components/audit/AuditEventsTable.jsx';
import { AuditFilters } from '../../components/audit/AuditFilters.jsx';
import { EmptyState } from '../../components/ui/EmptyState.jsx';
import { ErrorState } from '../../components/ui/ErrorState.jsx';
import {
  AUDIT_EVENT_TYPES,
  DEFAULT_AUDIT_PAGE_LIMIT,
  MAX_AUDIT_PAGE_LIMIT,
} from '../../constants/auditCatalog.js';
import { useAuditEvents } from '../../hooks/audit/useAuditQueries.js';

function parseLimit(raw) {
  const parsed = Number.parseInt(raw ?? '', 10);
  if (Number.isNaN(parsed)) return DEFAULT_AUDIT_PAGE_LIMIT;
  return Math.min(Math.max(parsed, 1), MAX_AUDIT_PAGE_LIMIT);
}

function parseOffset(raw) {
  const parsed = Number.parseInt(raw ?? '', 10);
  if (Number.isNaN(parsed) || parsed < 0) return 0;
  return parsed;
}

export function AuditLogsListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const eventTypeParam = searchParams.get('eventType') ?? '';
  const eventType = AUDIT_EVENT_TYPES.includes(eventTypeParam) ? eventTypeParam : '';
  const limit = parseLimit(searchParams.get('limit'));
  const offset = parseOffset(searchParams.get('offset'));

  const filters = useMemo(
    () => ({
      limit,
      offset,
      ...(eventType ? { eventType } : {}),
    }),
    [limit, offset, eventType],
  );

  const { data, isLoading, isError, error, refetch, isFetching } = useAuditEvents(filters);

  const events = data?.events ?? [];
  const total = data?.total ?? 0;
  const hasFilters = Boolean(eventType);

  const updateFilter = useCallback(
    (field, value) => {
      const params = new URLSearchParams(searchParams);
      if (value) params.set(field, value);
      else params.delete(field);
      params.set('offset', '0');
      setSearchParams(params);
    },
    [searchParams, setSearchParams],
  );

  const resetFilters = useCallback(() => {
    const params = new URLSearchParams();
    params.set('limit', String(limit));
    params.set('offset', '0');
    setSearchParams(params);
  }, [limit, setSearchParams]);

  const goPrevious = useCallback(() => {
    const params = new URLSearchParams(searchParams);
    params.set('offset', String(Math.max(0, offset - limit)));
    setSearchParams(params);
  }, [limit, offset, searchParams, setSearchParams]);

  const goNext = useCallback(() => {
    const params = new URLSearchParams(searchParams);
    params.set('offset', String(offset + limit));
    setSearchParams(params);
  }, [limit, offset, searchParams, setSearchParams]);

  return (
    <>
      <PageHeader
        title="Audit logs"
        description="Read-only security and operational events for your tenant."
        action={
          <Button size="small" variant="outlined" onClick={() => refetch()} disabled={isFetching}>
            Refresh
          </Button>
        }
      />
      <AuditFilters
        eventType={eventType}
        onChange={updateFilter}
        onReset={resetFilters}
        hasFilters={hasFilters}
      />
      {isError ? (
        <ErrorState
          error={error}
          title={error?.httpStatus === 403 ? 'Access denied' : 'Unable to load audit events'}
          onRetry={() => refetch()}
        />
      ) : null}
      {!isError && !isLoading && events.length === 0 ? (
        <EmptyState
          title={hasFilters ? 'No audit events match your filters' : 'No audit events found'}
          description={
            hasFilters
              ? 'Try resetting filters or choose a different event type.'
              : 'Activity will appear here as users and integrations operate in your tenant.'
          }
          action={
            hasFilters ? (
              <Button size="small" onClick={resetFilters}>
                Reset filters
              </Button>
            ) : null
          }
        />
      ) : null}
      {!isError && (isLoading || events.length > 0) ? (
        <>
          <AuditEventsTable events={events} isLoading={isLoading} />
          <OffsetPagination
            total={total}
            limit={limit}
            offset={offset}
            onPrevious={goPrevious}
            onNext={goNext}
            isLoading={isLoading || isFetching}
          />
        </>
      ) : null}
    </>
  );
}
