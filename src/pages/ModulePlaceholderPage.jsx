import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import { useLocation } from 'react-router-dom';
import { findNavItemByPath } from '../constants/navigationConfig.js';

export function ModulePlaceholderPage() {
  const { pathname } = useLocation();
  const navItem = findNavItemByPath(pathname);
  const title = navItem?.label ?? 'Module';

  return (
    <>
      <Typography variant="body2" color="text.secondary" paragraph>
        The <strong>{title}</strong> module will be implemented in a later phase. Navigation is
        wired for future RBAC; permission-based menu filtering is pending backend support on{' '}
        <code>GET /auth/me</code> (GAP-1).
      </Typography>
      <Alert severity="info" variant="outlined">
        This page is an intentional placeholder — no sample production data is shown.
      </Alert>
    </>
  );
}
