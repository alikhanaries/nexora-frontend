import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { LoadingScreen } from '../components/ui/LoadingScreen.jsx';

const RolesListPage = lazy(() =>
  import('../pages/roles/RolesListPage.jsx').then((m) => ({ default: m.RolesListPage })),
);
const RoleCreatePage = lazy(() =>
  import('../pages/roles/RoleCreatePage.jsx').then((m) => ({ default: m.RoleCreatePage })),
);

export function RolesRoutes() {
  return (
    <Routes>
      <Route
        index
        element={
          <Suspense fallback={<LoadingScreen message="Loading roles…" />}>
            <RolesListPage />
          </Suspense>
        }
      />
      <Route
        path="new"
        element={
          <Suspense fallback={<LoadingScreen message="Loading form…" />}>
            <RoleCreatePage />
          </Suspense>
        }
      />
    </Routes>
  );
}
