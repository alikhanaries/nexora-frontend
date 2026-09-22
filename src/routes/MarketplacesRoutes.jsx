import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { LoadingScreen } from '../components/ui/LoadingScreen.jsx';

const MarketplacesListPage = lazy(() =>
  import('../pages/marketplaces/MarketplacesListPage.jsx').then((m) => ({ default: m.MarketplacesListPage })),
);
const MarketplaceCreatePage = lazy(() =>
  import('../pages/marketplaces/MarketplaceCreatePage.jsx').then((m) => ({ default: m.MarketplaceCreatePage })),
);
const MarketplaceDetailPage = lazy(() =>
  import('../pages/marketplaces/MarketplaceDetailPage.jsx').then((m) => ({ default: m.MarketplaceDetailPage })),
);
const MarketplaceEditPage = lazy(() =>
  import('../pages/marketplaces/MarketplaceEditPage.jsx').then((m) => ({ default: m.MarketplaceEditPage })),
);

function LazyPage({ children }) {
  return <Suspense fallback={<LoadingScreen message="Loading page…" />}>{children}</Suspense>;
}

export function MarketplacesRoutes() {
  return (
    <Routes>
      <Route
        index
        element={
          <LazyPage>
            <MarketplacesListPage />
          </LazyPage>
        }
      />
      <Route
        path="new"
        element={
          <LazyPage>
            <MarketplaceCreatePage />
          </LazyPage>
        }
      />
      <Route
        path=":marketplaceId/edit"
        element={
          <LazyPage>
            <MarketplaceEditPage />
          </LazyPage>
        }
      />
      <Route
        path=":marketplaceId"
        element={
          <LazyPage>
            <MarketplaceDetailPage />
          </LazyPage>
        }
      />
    </Routes>
  );
}
