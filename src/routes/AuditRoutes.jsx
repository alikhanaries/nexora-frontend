import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { LoadingScreen } from '../components/ui/LoadingScreen.jsx';

const AuditLogsListPage = lazy(() =>
  import('../pages/audit/AuditLogsListPage.jsx').then((m) => ({ default: m.AuditLogsListPage })),
);

function LazyPage({ children }) {
  return <Suspense fallback={<LoadingScreen message="Loading page…" />}>{children}</Suspense>;
}

export function AuditRoutes() {
  return (
    <Routes>
      <Route
        index
        element={
          <LazyPage>
            <AuditLogsListPage />
          </LazyPage>
        }
      />
    </Routes>
  );
}
