import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { LoadingScreen } from '../components/ui/LoadingScreen.jsx';

const InventoryPage = lazy(() =>
  import('../pages/inventory/InventoryPage.jsx').then((m) => ({ default: m.InventoryPage })),
);
const StockLocationDetailPage = lazy(() =>
  import('../pages/inventory/StockLocationDetailPage.jsx').then((m) => ({
    default: m.StockLocationDetailPage,
  })),
);

export function InventoryRoutes() {
  return (
    <Routes>
      <Route
        index
        element={
          <Suspense fallback={<LoadingScreen message="Loading inventory…" />}>
            <InventoryPage />
          </Suspense>
        }
      />
      <Route
        path="locations/:stockLocationId"
        element={
          <Suspense fallback={<LoadingScreen message="Loading location…" />}>
            <StockLocationDetailPage />
          </Suspense>
        }
      />
    </Routes>
  );
}
