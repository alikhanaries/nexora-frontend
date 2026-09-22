import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { LoadingScreen } from '../components/ui/LoadingScreen.jsx';

const OffersListPage = lazy(() =>
  import('../pages/offers/OffersListPage.jsx').then((m) => ({ default: m.OffersListPage })),
);
const OfferDetailPage = lazy(() =>
  import('../pages/offers/OfferDetailPage.jsx').then((m) => ({ default: m.OfferDetailPage })),
);
const OfferCreatePage = lazy(() =>
  import('../pages/offers/OfferCreatePage.jsx').then((m) => ({ default: m.OfferCreatePage })),
);
const OfferEditPage = lazy(() =>
  import('../pages/offers/OfferEditPage.jsx').then((m) => ({ default: m.OfferEditPage })),
);

export function OffersRoutes() {
  return (
    <Routes>
      <Route
        index
        element={
          <Suspense fallback={<LoadingScreen message="Loading offers…" />}>
            <OffersListPage />
          </Suspense>
        }
      />
      <Route
        path="new"
        element={
          <Suspense fallback={<LoadingScreen message="Loading form…" />}>
            <OfferCreatePage />
          </Suspense>
        }
      />
      <Route
        path=":offerId/edit"
        element={
          <Suspense fallback={<LoadingScreen message="Loading form…" />}>
            <OfferEditPage />
          </Suspense>
        }
      />
      <Route
        path=":offerId"
        element={
          <Suspense fallback={<LoadingScreen message="Loading offer…" />}>
            <OfferDetailPage />
          </Suspense>
        }
      />
    </Routes>
  );
}
