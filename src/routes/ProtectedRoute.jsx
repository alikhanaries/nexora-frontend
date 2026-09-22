import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { LoadingScreen } from '../components/ui/LoadingScreen.jsx';
import { useAuth } from '../hooks/useAuth.js';

export function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingScreen message="Restoring session…" />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
