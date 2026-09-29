import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { LoadingScreen } from '../components/ui/LoadingScreen.jsx';

const ReturnsListPage = lazy(() =>
  import('../pages/returns/ReturnsListPage.jsx').then((m) => ({ default: m.ReturnsListPage })),
);
const ReturnDetailPage = lazy(() =>
  import('../pages/returns/ReturnDetailPage.jsx').then((m) => ({ default: m.ReturnDetailPage })),
);

export function ReturnsRoutes() {
  return (
    <Routes>
      <Route
        index
        element={
          <Suspense fallback={<LoadingScreen message="Loading returns…" />}>
            <ReturnsListPage />
          </Suspense>
        }
      />
      <Route
        path=":returnId"
        element={
          <Suspense fallback={<LoadingScreen message="Loading return…" />}>
            <ReturnDetailPage />
          </Suspense>
        }
      />
    </Routes>
  );
}
