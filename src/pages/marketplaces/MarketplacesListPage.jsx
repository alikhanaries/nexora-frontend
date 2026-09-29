import Button from '@mui/material/Button';
import { useCallback, useMemo } from 'react';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';
import { PageHeader } from '../../components/common/PageHeader.jsx';
import { MarketplaceFilters } from '../../components/marketplaces/MarketplaceFilters.jsx';
import { MarketplacesTable } from '../../components/marketplaces/MarketplacesTable.jsx';
import { EmptyState } from '../../components/ui/EmptyState.jsx';
import { ErrorState } from '../../components/ui/ErrorState.jsx';
import { useMarketplaces } from '../../hooks/marketplaces/useMarketplaceQueries.js';

export function MarketplacesListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const status = searchParams.get('status') ?? '';

  const filters = useMemo(() => ({ ...(status ? { status } : {}) }), [status]);

  const { data: marketplaces, isLoading, isError, error, refetch } = useMarketplaces(filters);

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

  const list = marketplaces ?? [];
  const hasFilters = Boolean(status);

  return (
    <>
      <PageHeader
        title="Marketplaces"
        description="Global marketplace definitions used when configuring tenant channels."
        action={
          <Button component={RouterLink} to="/marketplaces/new" variant="contained" size="small">
            New marketplace
          </Button>
        }
      />
      <MarketplaceFilters
        status={status}
        onChange={updateFilter}
        onReset={resetFilters}
        hasFilters={hasFilters}
      />
      {isError ? <ErrorState error={error} onRetry={() => refetch()} /> : null}
      {!isError && !isLoading && list.length === 0 ? (
        <EmptyState
          title={hasFilters ? 'No marketplaces match your filters' : 'No marketplaces configured'}
          description={
            hasFilters
              ? 'Try resetting filters or create a marketplace with a different status.'
              : 'Create a marketplace definition before connecting channels.'
          }
          action={
            hasFilters ? (
              <Button size="small" onClick={resetFilters}>
                Reset filters
              </Button>
            ) : (
              <Button component={RouterLink} to="/marketplaces/new" variant="contained" size="small">
                Create marketplace
              </Button>
            )
          }
        />
      ) : null}
      {!isError && (isLoading || list.length > 0) ? (
        <MarketplacesTable marketplaces={list} isLoading={isLoading} />
      ) : null}
    </>
  );
}
