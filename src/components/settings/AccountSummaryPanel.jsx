import Grid from '@mui/material/Grid2';
import Paper from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import { StatusBadge } from '../common/StatusBadge.jsx';
import { useAuth } from '../../hooks/useAuth.js';

export function AccountSummaryPanel() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Paper variant="outlined" className="p-4">
        <Skeleton variant="text" width={160} />
        <Skeleton variant="rounded" height={80} className="mt-2" />
      </Paper>
    );
  }

  if (!user) return null;

  return (
    <Paper variant="outlined" className="p-4">
      <Typography variant="subtitle2" gutterBottom>
        Account
      </Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography variant="caption" color="text.secondary">
            Email
          </Typography>
          <Typography variant="body2">{user.email}</Typography>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography variant="caption" color="text.secondary">
            User status
          </Typography>
          <Typography component="div" variant="body2" className="mt-0.5">
            <StatusBadge status={user.status} />
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography variant="caption" color="text.secondary">
            Membership
          </Typography>
          <Typography variant="body2">{user.membershipStatus}</Typography>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography variant="caption" color="text.secondary">
            Tenant ID
          </Typography>
          <Typography variant="body2" sx={{ wordBreak: 'break-all', fontFamily: 'monospace', fontSize: 12 }}>
            {user.tenantId}
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography variant="caption" color="text.secondary">
            User ID
          </Typography>
          <Typography variant="body2" sx={{ wordBreak: 'break-all', fontFamily: 'monospace', fontSize: 12 }}>
            {user.id}
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  );
}
