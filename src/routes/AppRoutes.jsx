import { Navigate, Route, Routes } from 'react-router-dom';
import { navigationConfig } from '../constants/navigationConfig.js';
import { AppLayout } from '../layouts/AppLayout.jsx';
import { AuthLayout } from '../layouts/AuthLayout.jsx';
import { LoginPage } from '../pages/auth/LoginPage.jsx';
import { ModulePlaceholderPage } from '../pages/ModulePlaceholderPage.jsx';
import { GuestRoute } from './GuestRoute.jsx';
import { ProtectedRoute } from './ProtectedRoute.jsx';

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<GuestRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          {navigationConfig.map((item) =>
            item.path === '/' ? (
              <Route key={item.id} index element={<ModulePlaceholderPage />} />
            ) : (
              <Route
                key={item.id}
                path={item.path.replace(/^\//, '')}
                element={<ModulePlaceholderPage />}
              />
            ),
          )}
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
