import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid2';
import Paper from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { PageHeader } from '../../components/common/PageHeader.jsx';
import { StatusBadge } from '../../components/common/StatusBadge.jsx';
import { useCancellation } from '../../hooks/cancellations/useCancellationQueries.js';
import { ErrorState } from '../../components/ui/ErrorState.jsx';
import { formatDate } from '../../utils/formatDate.js';

export function CancellationDetailPage() {
  const { cancellationId } = useParams();
  const { data: cancellation, isLoading, isError, error, refetch } = useCancellation(cancellationId);

  if (isLoading) {
    return (
      <Box className="flex flex-col gap-4">
        <Skeleton variant="text" width={240} height={40} />
        <Skeleton variant="rounded" height={200} />
      </Box>
    );
  }

  if (isError) {
    return (
      <ErrorState
        error={error}
        title={error?.httpStatus === 404 ? 'Cancellation not found' : 'Unable to load cancellation'}
        onRetry={() => refetch()}
      />
    );
  }

  if (!cancellation) return null;

  const lines = cancellation.lines ?? [];

  return (
    <>
      <Button component={RouterLink} to="/cancellations" startIcon={<ArrowBackIcon />} size="small" sx={{ mb: 2 }}>
        Back to cancellations
      </Button>
      <PageHeader title="Cancellation" description={`ID: ${cancellation.id}`} />
      <Paper className="mb-4 p-4">
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Status
            </Typography>
            <StatusBadge status={cancellation.status} domain="cancellation" />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Order
            </Typography>
            <Typography
              component={RouterLink}
              to={`/orders/${cancellation.orderId}`}
              variant="body2"
              sx={{ color: 'primary.main' }}
            >
              {cancellation.orderId}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Reason
            </Typography>
            <Typography variant="body2">{cancellation.reason?.trim() ? cancellation.reason : '—'}</Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Created
            </Typography>
            <Typography variant="body2">{formatDate(cancellation.createdAt)}</Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Updated
            </Typography>
            <Typography variant="body2">{formatDate(cancellation.updatedAt)}</Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Completed
            </Typography>
            <Typography variant="body2">
              {cancellation.completedAt ? formatDate(cancellation.completedAt) : '—'}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
      {lines.length > 0 ? (
        <>
          <Typography variant="subtitle1" className="mb-2">
            Cancelled lines
          </Typography>
          <TableContainer component={Paper} className="overflow-x-auto">
            <Table size="small" aria-label="Cancellation lines">
              <TableHead>
                <TableRow>
                  <TableCell>Order line</TableCell>
                  <TableCell align="right">Quantity</TableCell>
                  <TableCell>Created</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {lines.map((line) => (
                  <TableRow key={line.id}>
                    <TableCell sx={{ fontFamily: 'monospace', fontSize: 12 }}>{line.orderLineId}</TableCell>
                    <TableCell align="right">{line.quantity}</TableCell>
                    <TableCell>{formatDate(line.createdAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      ) : null}
    </>
  );
}
