import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { LoadingScreen } from '../components/ui/LoadingScreen.jsx';

const OrdersListPage = lazy(() =>
  import('../pages/orders/OrdersListPage.jsx').then((m) => ({ default: m.OrdersListPage })),
);
const OrderDetailPage = lazy(() =>
  import('../pages/orders/OrderDetailPage.jsx').then((m) => ({ default: m.OrderDetailPage })),
);
const OrderCreatePage = lazy(() =>
  import('../pages/orders/OrderCreatePage.jsx').then((m) => ({ default: m.OrderCreatePage })),
);

export function OrdersRoutes() {
  return (
    <Routes>
      <Route
        index
        element={
          <Suspense fallback={<LoadingScreen message="Loading orders…" />}>
            <OrdersListPage />
          </Suspense>
        }
      />
      <Route
        path="new"
        element={
          <Suspense fallback={<LoadingScreen message="Loading form…" />}>
            <OrderCreatePage />
          </Suspense>
        }
      />
      <Route
        path=":orderId"
        element={
          <Suspense fallback={<LoadingScreen message="Loading order…" />}>
            <OrderDetailPage />
          </Suspense>
        }
      />
    </Routes>
  );
}
