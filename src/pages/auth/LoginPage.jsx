import Typography from '@mui/material/Typography';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { LoginForm } from '../../components/forms/LoginForm.jsx';
import { LoadingScreen } from '../../components/ui/LoadingScreen.jsx';
import { useAuth } from '../../hooks/useAuth.js';
import { getSafeRedirectPath } from '../../utils/safeRedirect.js';

export function LoginPage() {
  const { login, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const redirectTo = getSafeRedirectPath(location.state?.from);

  const handleLogin = async (values) => {
    await login(values);
    navigate(redirectTo, { replace: true });
  };

  if (isLoading) {
    return <LoadingScreen message="Restoring session…" />;
  }

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return (
    <>
      <Typography variant="h2" component="h1" gutterBottom>
        Sign in to Nexora
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Marketplace integration console for your tenant.
      </Typography>
      <LoginForm onSubmit={handleLogin} />
    </>
  );
}
