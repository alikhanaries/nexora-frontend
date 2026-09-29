import { Outlet } from 'react-router-dom';
import { LoadingScreen } from '../components/ui/LoadingScreen.jsx';
import { AccessDeniedPage } from '../pages/auth/AccessDeniedPage.jsx';
import { usePermissions } from '../hooks/permissions/usePermissions.js';

/**
 * Route-level UX guard when backend permission data is available on the session principal.
 *
 * @param {{ permission?: string, anyOf?: string[] }} props
 */
export function RequirePermission({ permission, anyOf }) {
  const { can, canAny, isRbacAvailable, isLoading } = usePermissions();

  if (isLoading) {
    return <LoadingScreen message="Loading access…" />;
  }

  if (!isRbacAvailable) {
    return <Outlet />;
  }

  const allowed =
    permission !== undefined ? can(permission) : anyOf !== undefined ? canAny(anyOf) : true;

  if (!allowed) {
    return <AccessDeniedPage />;
  }

  return <Outlet />;
}
