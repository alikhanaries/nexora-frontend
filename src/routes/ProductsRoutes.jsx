import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { LoadingScreen } from '../components/ui/LoadingScreen.jsx';

const ProductsListPage = lazy(() =>
  import('../pages/products/ProductsListPage.jsx').then((m) => ({ default: m.ProductsListPage })),
);
const ProductDetailPage = lazy(() =>
  import('../pages/products/ProductDetailPage.jsx').then((m) => ({ default: m.ProductDetailPage })),
);
const ProductCreatePage = lazy(() =>
  import('../pages/products/ProductCreatePage.jsx').then((m) => ({ default: m.ProductCreatePage })),
);
const ProductEditPage = lazy(() =>
  import('../pages/products/ProductEditPage.jsx').then((m) => ({ default: m.ProductEditPage })),
);

function LazyPage({ children }) {
  return <Suspense fallback={<LoadingScreen message="Loading page…" />}>{children}</Suspense>;
}

export function ProductsRoutes() {
  return (
    <Routes>
      <Route
        index
        element={
          <LazyPage>
            <ProductsListPage />
          </LazyPage>
        }
      />
      <Route
        path="new"
        element={
          <LazyPage>
            <ProductCreatePage />
          </LazyPage>
        }
      />
      <Route
        path=":productId/edit"
        element={
          <LazyPage>
            <ProductEditPage />
          </LazyPage>
        }
      />
      <Route
        path=":productId"
        element={
          <LazyPage>
            <ProductDetailPage />
          </LazyPage>
        }
      />
    </Routes>
  );
}
