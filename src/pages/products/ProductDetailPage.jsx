import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid2';
import Paper from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { PageHeader } from '../../components/common/PageHeader.jsx';
import { StatusBadge } from '../../components/common/StatusBadge.jsx';
import { PRODUCT_STATUS } from '../../constants/productCatalog.js';
import { useArchiveProduct, useDeactivateProduct } from '../../hooks/products/useProductMutations.js';
import { useProduct, useProductContent } from '../../hooks/products/useProduct.js';
import { useNotification } from '../../hooks/useNotification.js';
import { ErrorState } from '../../components/ui/ErrorState.jsx';
import { formatDate } from '../../utils/formatDate.js';
import { confirmAction } from '../../utils/confirmDialog.js';

export function ProductDetailPage() {
  const { productId } = useParams();
  const { data: product, isLoading, isError, error, refetch } = useProduct(productId);
  const { data: content, isLoading: contentLoading } = useProductContent(productId);
  const deactivateMutation = useDeactivateProduct();
  const archiveMutation = useArchiveProduct();
  const { notify } = useNotification();

  const runDeactivate = async () => {
    if (!product) return;
    const result = await confirmAction({
      title: 'Deactivate product?',
      text: `Deactivate "${product.merchantSku}"?`,
      confirmButtonText: 'Deactivate',
    });
    if (!result.isConfirmed) return;
    await deactivateMutation.mutateAsync(product.id);
    notify('Product deactivated.', 'success');
  };

  const runArchive = async () => {
    if (!product) return;
    const result = await confirmAction({
      title: 'Archive product?',
      text: `Archive "${product.merchantSku}"?`,
      confirmButtonText: 'Archive',
    });
    if (!result.isConfirmed) return;
    await archiveMutation.mutateAsync(product.id);
    notify('Product archived.', 'success');
  };

  if (isLoading) {
    return (
      <Box className="flex flex-col gap-4">
        <Skeleton variant="text" width={240} height={40} />
        <Skeleton variant="rounded" height={200} />
      </Box>
    );
  }

  if (isError) {
    return (
      <ErrorState
        error={error}
        title={error?.httpStatus === 404 ? 'Product not found' : 'Unable to load product'}
        onRetry={() => refetch()}
      />
    );
  }

  if (!product) {
    return null;
  }

  return (
    <>
      <Button
        component={RouterLink}
        to="/products"
        startIcon={<ArrowBackIcon />}
        size="small"
        sx={{ mb: 2 }}
      >
        Back to products
      </Button>
      <PageHeader
        title={product.merchantSku}
        description={`Product ID: ${product.id}`}
        action={
          <Box className="flex flex-wrap gap-2">
            <Button component={RouterLink} to={`/products/${product.id}/edit`} variant="outlined" size="small">
              Edit
            </Button>
            {product.status === PRODUCT_STATUS.ACTIVE ? (
              <Button variant="outlined" color="warning" size="small" onClick={runDeactivate}>
                Deactivate
              </Button>
            ) : null}
            {product.status !== PRODUCT_STATUS.ARCHIVED ? (
              <Button variant="outlined" color="error" size="small" onClick={runArchive}>
                Archive
              </Button>
            ) : null}
          </Box>
        }
      />
      <Paper className="p-4">
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Status
            </Typography>
            <StatusBadge status={product.status} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Product type
            </Typography>
            <Typography variant="body2">{product.productType}</Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              External reference
            </Typography>
            <Typography variant="body2">{product.externalReference ?? '—'}</Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Timestamps
            </Typography>
            <Typography variant="body2">Created {formatDate(product.createdAt)}</Typography>
            <Typography variant="body2">Updated {formatDate(product.updatedAt)}</Typography>
          </Grid>
        </Grid>
      </Paper>
      <Box sx={{ mt: 3 }}>
        <Typography variant="h3" component="h2" gutterBottom>
          Localized content
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Read-only in this phase. Content editing uses separate API endpoints for a future iteration.
        </Typography>
        <Paper className="p-4">
          {contentLoading ? (
            <Skeleton variant="rounded" height={120} />
          ) : content && content.length > 0 ? (
            content.map((entry) => (
              <Box key={entry.id} sx={{ mb: 2 }}>
                <Typography variant="subtitle2">{entry.locale}</Typography>
                <Typography variant="body2">Title: {entry.title ?? '—'}</Typography>
                <Typography variant="body2">Brand: {entry.brand ?? '—'}</Typography>
                <Divider sx={{ mt: 1 }} />
              </Box>
            ))
          ) : (
            <Typography variant="body2" color="text.secondary">
              No localized content entries yet.
            </Typography>
          )}
        </Paper>
      </Box>
    </>
  );
}
