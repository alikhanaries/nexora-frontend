import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { LoadingScreen } from '../components/ui/LoadingScreen.jsx';

const SettingsPage = lazy(() =>
  import('../pages/settings/SettingsPage.jsx').then((m) => ({ default: m.SettingsPage })),
);

export function SettingsRoutes() {
  return (
    <Routes>
      <Route
        index
        element={
          <Suspense fallback={<LoadingScreen message="Loading settings…" />}>
            <SettingsPage />
          </Suspense>
        }
      />
    </Routes>
  );
}
