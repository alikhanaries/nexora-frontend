import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import { useCallback, useMemo, useState } from 'react';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';
import { PageHeader } from '../../components/common/PageHeader.jsx';
import { CursorPagination } from '../../components/common/CursorPagination.jsx';
import { ProductFilters } from '../../components/products/ProductFilters.jsx';
import { ProductsTable } from '../../components/products/ProductsTable.jsx';
import { EmptyState } from '../../components/ui/EmptyState.jsx';
import { ErrorState } from '../../components/ui/ErrorState.jsx';
import { DEFAULT_PRODUCT_LIST_LIMIT } from '../../constants/productCatalog.js';
import { useArchiveProduct, useDeactivateProduct } from '../../hooks/products/useProductMutations.js';
import { useProducts } from '../../hooks/products/useProducts.js';
import { useNotification } from '../../hooks/useNotification.js';
import { confirmAction } from '../../utils/confirmDialog.js';

export function ProductsListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const status = searchParams.get('status') ?? '';
  const cursor = searchParams.get('cursor') ?? '';
  const [cursorBackStack, setCursorBackStack] = useState(/** @type {string[]} */ ([]));

  const filters = useMemo(
    () => ({
      limit: DEFAULT_PRODUCT_LIST_LIMIT,
      ...(cursor ? { cursor } : {}),
      ...(status ? { status } : {}),
    }),
    [cursor, status],
  );

  const { data, isLoading, isFetching, isError, error, refetch } = useProducts(filters);
  const deactivateMutation = useDeactivateProduct();
  const archiveMutation = useArchiveProduct();
  const { notify } = useNotification();

  const setStatusFilter = useCallback(
    (nextStatus) => {
      setCursorBackStack([]);
      const params = new URLSearchParams();
      if (nextStatus) params.set('status', nextStatus);
      setSearchParams(params);
    },
    [setSearchParams],
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

  const handleDeactivate = async (product) => {
    const result = await confirmAction({
      title: 'Deactivate product?',
      text: `Deactivate "${product.merchantSku}"? The product will become inactive.`,
      confirmButtonText: 'Deactivate',
    });
    if (!result.isConfirmed) return;
    await deactivateMutation.mutateAsync(product.id);
    notify('Product deactivated.', 'success');
  };

  const handleArchive = async (product) => {
    const result = await confirmAction({
      title: 'Archive product?',
      text: `Archive "${product.merchantSku}"? This is intended for products no longer sold.`,
      confirmButtonText: 'Archive',
    });
    if (!result.isConfirmed) return;
    await archiveMutation.mutateAsync(product.id);
    notify('Product archived.', 'success');
  };

  const products = data?.items ?? [];
  const hasActiveFilters = Boolean(status);
  const emptyTitle = hasActiveFilters ? 'No products match your filters' : 'No products yet';
  const emptyDescription = hasActiveFilters
    ? 'Try clearing the status filter or adjust your criteria.'
    : 'Create your first product to start building your catalog.';

  return (
    <>
      <PageHeader
        title="Products"
        description="Manage merchant SKUs and product lifecycle for your tenant catalog."
        action={
          <Button component={RouterLink} to="/products/new" variant="contained" startIcon={<AddIcon />}>
            New product
          </Button>
        }
      />
      <ProductFilters status={status} onStatusChange={setStatusFilter} />
      {isError ? <ErrorState error={error} onRetry={() => refetch()} /> : null}
      {!isError && !isLoading && products.length === 0 ? (
        <EmptyState
          title={emptyTitle}
          description={emptyDescription}
          action={
            !hasActiveFilters ? (
              <Button component={RouterLink} to="/products/new" variant="contained" size="small">
                Create product
              </Button>
            ) : null
          }
        />
      ) : null}
      {!isError && (isLoading || products.length > 0) ? (
        <>
          <ProductsTable
            products={products}
            isLoading={isLoading}
            onDeactivate={handleDeactivate}
            onArchive={handleArchive}
          />
          <CursorPagination
            hasMore={Boolean(data?.hasMore)}
            canGoBack={cursorBackStack.length > 0 || Boolean(cursor)}
            onNext={goNext}
            onPrevious={goPrevious}
            isLoading={isFetching}
            itemCount={products.length}
          />
        </>
      ) : null}
    </>
  );
}
