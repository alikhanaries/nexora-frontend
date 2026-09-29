import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { LoadingScreen } from '../components/ui/LoadingScreen.jsx';

const ApiKeysListPage = lazy(() =>
  import('../pages/api-keys/ApiKeysListPage.jsx').then((m) => ({ default: m.ApiKeysListPage })),
);
const ApiKeyCreatePage = lazy(() =>
  import('../pages/api-keys/ApiKeyCreatePage.jsx').then((m) => ({ default: m.ApiKeyCreatePage })),
);

function LazyPage({ children }) {
  return <Suspense fallback={<LoadingScreen message="Loading page…" />}>{children}</Suspense>;
}

export function ApiKeysRoutes() {
  return (
    <Routes>
      <Route
        index
        element={
          <LazyPage>
            <ApiKeysListPage />
          </LazyPage>
        }
      />
      <Route
        path="new"
        element={
          <LazyPage>
            <ApiKeyCreatePage />
          </LazyPage>
        }
      />
    </Routes>
  );
}
