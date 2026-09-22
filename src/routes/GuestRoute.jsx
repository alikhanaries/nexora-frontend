import { Navigate, Outlet } from 'react-router-dom';
import { LoadingScreen } from '../components/ui/LoadingScreen.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { getSafeRedirectPath } from '../utils/safeRedirect.js';

export function GuestRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen message="Restoring session…" />;
  }

  if (isAuthenticated) {
    return <Navigate to={getSafeRedirectPath('/')} replace />;
  }

  return <Outlet />;
}
