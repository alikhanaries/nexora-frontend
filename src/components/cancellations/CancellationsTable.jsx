import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { Link as RouterLink } from 'react-router-dom';
import { StatusBadge } from '../common/StatusBadge.jsx';
import { TableSkeleton } from '../tables/TableSkeleton.jsx';
import { formatDate } from '../../utils/formatDate.js';

/**
 * @param {{
 *   cancellations: import('../../services/api/cancellationsService.js').CancellationSummary[],
 *   isLoading: boolean,
 * }} props
 */
export function CancellationsTable({ cancellations, isLoading }) {
  return (
    <TableContainer component={Paper} className="overflow-x-auto">
      <Table size="small" aria-label="Cancellations">
        <TableHead>
          <TableRow>
            <TableCell>Cancellation</TableCell>
            <TableCell>Order</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Reason</TableCell>
            <TableCell>Lines</TableCell>
            <TableCell>Created</TableCell>
            <TableCell>Completed</TableCell>
          </TableRow>
        </TableHead>
        {isLoading ? (
          <TableSkeleton columns={7} />
        ) : (
          <TableBody>
            {cancellations.map((cancellation) => (
              <TableRow key={cancellation.id} hover>
                <TableCell>
                  <Typography
                    component={RouterLink}
                    to={`/cancellations/${cancellation.id}`}
                    variant="body2"
                    sx={{ fontFamily: 'monospace', fontSize: 12, color: 'primary.main', textDecoration: 'none' }}
                  >
                    {cancellation.id.slice(0, 8)}…
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    component={RouterLink}
                    to={`/orders/${cancellation.orderId}`}
                    variant="body2"
                    sx={{ fontFamily: 'monospace', fontSize: 12, color: 'primary.main', textDecoration: 'none' }}
                  >
                    {cancellation.orderId.slice(0, 8)}…
                  </Typography>
                </TableCell>
                <TableCell>
                  <StatusBadge status={cancellation.status} domain="cancellation" />
                </TableCell>
                <TableCell sx={{ maxWidth: 240 }}>
                  <Typography variant="body2" noWrap title={cancellation.reason ?? undefined}>
                    {cancellation.reason?.trim() ? cancellation.reason : '—'}
                  </Typography>
                </TableCell>
                <TableCell>{cancellation.lines?.length ?? '—'}</TableCell>
                <TableCell>{formatDate(cancellation.createdAt)}</TableCell>
                <TableCell>{cancellation.completedAt ? formatDate(cancellation.completedAt) : '—'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        )}
      </Table>
    </TableContainer>
  );
}
