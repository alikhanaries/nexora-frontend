import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/common/PageHeader.jsx';
import { ProductForm } from '../../components/products/ProductForm.jsx';
import { useCreateProduct } from '../../hooks/products/useProductMutations.js';
import { useNotification } from '../../hooks/useNotification.js';

export function ProductCreatePage() {
  const navigate = useNavigate();
  const createMutation = useCreateProduct();
  const { notify } = useNotification();

  return (
    <>
      <PageHeader
        title="New product"
        description="Create a merchant SKU in your tenant catalog."
      />
      <ProductForm
        mode="create"
        isSubmitting={createMutation.isPending}
        onCancel={() => navigate('/products')}
        onSubmit={async (values) => {
          const product = await createMutation.mutateAsync(values);
          notify('Product created.', 'success');
          navigate(`/products/${product.id}`);
        }}
      />
    </>
  );
}
