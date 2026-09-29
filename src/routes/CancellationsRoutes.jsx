import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { LoadingScreen } from '../components/ui/LoadingScreen.jsx';

const CancellationsListPage = lazy(() =>
  import('../pages/cancellations/CancellationsListPage.jsx').then((m) => ({ default: m.CancellationsListPage })),
);
const CancellationDetailPage = lazy(() =>
  import('../pages/cancellations/CancellationDetailPage.jsx').then((m) => ({ default: m.CancellationDetailPage })),
);
const CancellationCreatePage = lazy(() =>
  import('../pages/cancellations/CancellationCreatePage.jsx').then((m) => ({
    default: m.CancellationCreatePage,
  })),
);

export function CancellationsRoutes() {
  return (
    <Routes>
      <Route
        index
        element={
          <Suspense fallback={<LoadingScreen message="Loading cancellations…" />}>
            <CancellationsListPage />
          </Suspense>
        }
      />
      <Route
        path="new"
        element={
          <Suspense fallback={<LoadingScreen message="Loading form…" />}>
            <CancellationCreatePage />
          </Suspense>
        }
      />
      <Route
        path=":cancellationId"
        element={
          <Suspense fallback={<LoadingScreen message="Loading cancellation…" />}>
            <CancellationDetailPage />
          </Suspense>
        }
      />
    </Routes>
  );
}
