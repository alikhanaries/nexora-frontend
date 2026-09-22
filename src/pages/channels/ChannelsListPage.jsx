import Button from '@mui/material/Button';
import { useCallback, useMemo } from 'react';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';
import { PageHeader } from '../../components/common/PageHeader.jsx';
import { ChannelFilters } from '../../components/channels/ChannelFilters.jsx';
import { ChannelsTable } from '../../components/channels/ChannelsTable.jsx';
import { EmptyState } from '../../components/ui/EmptyState.jsx';
import { ErrorState } from '../../components/ui/ErrorState.jsx';
import { useChannels } from '../../hooks/channels/useChannelQueries.js';
import { useMarketplaces } from '../../hooks/marketplaces/useMarketplaceQueries.js';

export function ChannelsListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const status = searchParams.get('status') ?? '';
  const marketplaceId = searchParams.get('marketplaceId') ?? '';

  const filters = useMemo(
    () => ({
      ...(status ? { status } : {}),
      ...(marketplaceId ? { marketplaceId } : {}),
    }),
    [status, marketplaceId],
  );

  const { data: channels, isLoading, isError, error, refetch } = useChannels(filters);
  const { data: marketplaces } = useMarketplaces();

  const updateFilter = useCallback(
    (field, value) => {
      const params = new URLSearchParams(searchParams);
      if (value) params.set(field, value);
      else params.delete(field);
      setSearchParams(params);
    },
    [searchParams, setSearchParams],
  );

  const resetFilters = useCallback(() => {
    setSearchParams({});
  }, [setSearchParams]);

  const list = channels ?? [];
  const hasFilters = Boolean(status || marketplaceId);

  return (
    <>
      <PageHeader
        title="Channels"
        description="Sales channels linked to marketplaces for offers, pricing, and orders."
        action={
          <Button component={RouterLink} to="/channels/new" variant="contained" size="small">
            New channel
          </Button>
        }
      />
      <ChannelFilters
        status={status}
        marketplaceId={marketplaceId}
        onChange={updateFilter}
        onReset={resetFilters}
        hasFilters={hasFilters}
      />
      {isError ? <ErrorState error={error} onRetry={() => refetch()} /> : null}
      {!isError && !isLoading && list.length === 0 ? (
        <EmptyState
          title={hasFilters ? 'No channels match your filters' : 'No channels configured'}
          description={
            hasFilters
              ? 'Try resetting filters or create a channel for another marketplace.'
              : 'Create a channel to connect a marketplace to your tenant catalog and operations.'
          }
          action={
            hasFilters ? (
              <Button size="small" onClick={resetFilters}>
                Reset filters
              </Button>
            ) : (
              <Button component={RouterLink} to="/channels/new" variant="contained" size="small">
                Create channel
              </Button>
            )
          }
        />
      ) : null}
      {!isError && (isLoading || list.length > 0) ? (
        <ChannelsTable channels={list} marketplaces={marketplaces} isLoading={isLoading} />
      ) : null}
    </>
  );
}
