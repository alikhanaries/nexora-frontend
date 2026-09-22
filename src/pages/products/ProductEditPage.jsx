import { useNavigate, useParams } from 'react-router-dom';
import { PageHeader } from '../../components/common/PageHeader.jsx';
import { ProductForm } from '../../components/products/ProductForm.jsx';
import { useUpdateProduct } from '../../hooks/products/useProductMutations.js';
import { useProduct } from '../../hooks/products/useProduct.js';
import { useNotification } from '../../hooks/useNotification.js';
import { ErrorState } from '../../components/ui/ErrorState.jsx';
import { LoadingScreen } from '../../components/ui/LoadingScreen.jsx';

export function ProductEditPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { data: product, isLoading, isError, error, refetch } = useProduct(productId);
  const updateMutation = useUpdateProduct(productId);
  const { notify } = useNotification();

  if (isLoading) {
    return <LoadingScreen message="Loading product…" />;
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
      <PageHeader title="Edit product" description={product.merchantSku} />
      <ProductForm
        mode="edit"
        initialValues={{
          merchantSku: product.merchantSku,
          externalReference: product.externalReference ?? '',
          productType: product.productType,
        }}
        isSubmitting={updateMutation.isPending}
        onCancel={() => navigate(`/products/${product.id}`)}
        onSubmit={async (values) => {
          await updateMutation.mutateAsync(values);
          notify('Product updated.', 'success');
          navigate(`/products/${product.id}`);
        }}
      />
    </>
  );
}
