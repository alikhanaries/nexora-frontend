import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { LoadingScreen } from '../components/ui/LoadingScreen.jsx';

const PricingListPage = lazy(() =>
  import('../pages/pricing/PricingListPage.jsx').then((m) => ({ default: m.PricingListPage })),
);
const PriceDetailPage = lazy(() =>
  import('../pages/pricing/PriceDetailPage.jsx').then((m) => ({ default: m.PriceDetailPage })),
);
const PriceCreatePage = lazy(() =>
  import('../pages/pricing/PriceCreatePage.jsx').then((m) => ({ default: m.PriceCreatePage })),
);
const PriceEditPage = lazy(() =>
  import('../pages/pricing/PriceEditPage.jsx').then((m) => ({ default: m.PriceEditPage })),
);

export function PricingRoutes() {
  return (
    <Routes>
      <Route
        index
        element={
          <Suspense fallback={<LoadingScreen message="Loading pricing…" />}>
            <PricingListPage />
          </Suspense>
        }
      />
      <Route
        path="new"
        element={
          <Suspense fallback={<LoadingScreen message="Loading form…" />}>
            <PriceCreatePage />
          </Suspense>
        }
      />
      <Route
        path=":priceId/edit"
        element={
          <Suspense fallback={<LoadingScreen message="Loading form…" />}>
            <PriceEditPage />
          </Suspense>
        }
      />
      <Route
        path=":priceId"
        element={
          <Suspense fallback={<LoadingScreen message="Loading price…" />}>
            <PriceDetailPage />
          </Suspense>
        }
      />
    </Routes>
  );
}
