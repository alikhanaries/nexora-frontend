import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { LoadingScreen } from '../components/ui/LoadingScreen.jsx';

const ShipmentsListPage = lazy(() =>
  import('../pages/shipments/ShipmentsListPage.jsx').then((m) => ({ default: m.ShipmentsListPage })),
);
const ShipmentDetailPage = lazy(() =>
  import('../pages/shipments/ShipmentDetailPage.jsx').then((m) => ({ default: m.ShipmentDetailPage })),
);

export function ShipmentsRoutes() {
  return (
    <Routes>
      <Route
        index
        element={
          <Suspense fallback={<LoadingScreen message="Loading shipments…" />}>
            <ShipmentsListPage />
          </Suspense>
        }
      />
      <Route
        path=":shipmentId"
        element={
          <Suspense fallback={<LoadingScreen message="Loading shipment…" />}>
            <ShipmentDetailPage />
          </Suspense>
        }
      />
    </Routes>
  );
}
