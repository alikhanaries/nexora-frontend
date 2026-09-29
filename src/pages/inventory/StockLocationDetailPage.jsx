import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid2';
import Paper from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { PageHeader } from '../../components/common/PageHeader.jsx';
import { StatusBadge } from '../../components/common/StatusBadge.jsx';
import { ErrorState } from '../../components/ui/ErrorState.jsx';
import { useStockLocation } from '../../hooks/inventory/useInventoryQueries.js';
import { formatDate } from '../../utils/formatDate.js';

export function StockLocationDetailPage() {
  const { stockLocationId } = useParams();
  const { data: location, isLoading, isError, error, refetch } = useStockLocation(stockLocationId);

  return (
    <>
      <PageHeader
        title="Stock location"
        description="GET /stock-locations/:id"
        action={
          <Button
            component={RouterLink}
            to="/inventory"
            size="small"
            startIcon={<ArrowBackIcon />}
            variant="outlined"
          >
            Inventory
          </Button>
        }
      />

      {isLoading ? <Skeleton variant="rounded" height={160} /> : null}
      {isError ? <ErrorState error={error} onRetry={() => refetch()} /> : null}

      {location ? (
        <Paper variant="outlined" className="p-4">
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="caption" color="text.secondary">
                Name
              </Typography>
              <Typography variant="body2">{location.name}</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="caption" color="text.secondary">
                Status
              </Typography>
              <Typography component="div" variant="body2" className="mt-0.5">
                <StatusBadge status={location.status} domain="stockLocation" />
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="caption" color="text.secondary">
                External reference
              </Typography>
              <Typography variant="body2">{location.externalReference ?? '—'}</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="caption" color="text.secondary">
                Location ID
              </Typography>
              <Typography variant="body2" sx={{ wordBreak: 'break-all', fontFamily: 'monospace', fontSize: 12 }}>
                {location.id}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="caption" color="text.secondary">
                Created
              </Typography>
              <Typography variant="body2">{formatDate(location.createdAt)}</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="caption" color="text.secondary">
                Updated
              </Typography>
              <Typography variant="body2">{formatDate(location.updatedAt)}</Typography>
            </Grid>
          </Grid>
        </Paper>
      ) : null}
    </>
  );
}
