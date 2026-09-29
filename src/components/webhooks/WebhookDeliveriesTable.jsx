import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { StatusBadge } from '../common/StatusBadge.jsx';
import { TableSkeleton } from '../tables/TableSkeleton.jsx';
import { formatDate } from '../../utils/formatDate.js';

/**
 * @param {{
 *   deliveries: import('../../services/api/webhooksService.js').WebhookDelivery[],
 *   isLoading: boolean,
 * }} props
 */
export function WebhookDeliveriesTable({ deliveries, isLoading }) {
  return (
    <TableContainer component={Paper} className="overflow-x-auto">
      <Table size="small" aria-label="Webhook deliveries">
        <TableHead>
          <TableRow>
            <TableCell>Event</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Attempts</TableCell>
            <TableCell>HTTP</TableCell>
            <TableCell>Delivered</TableCell>
            <TableCell>Error</TableCell>
          </TableRow>
        </TableHead>
        {isLoading ? (
          <TableSkeleton columns={6} />
        ) : (
          <TableBody>
            {deliveries.map((delivery) => (
              <TableRow key={delivery.id} hover>
                <TableCell>
                  <Typography variant="body2" fontFamily="monospace">
                    {delivery.eventType}
                  </Typography>
                </TableCell>
                <TableCell>
                  <StatusBadge status={delivery.status} domain="webhookDelivery" />
                </TableCell>
                <TableCell>{delivery.attemptCount}</TableCell>
                <TableCell>{delivery.lastHttpStatus ?? '—'}</TableCell>
                <TableCell>{delivery.deliveredAt ? formatDate(delivery.deliveredAt) : '—'}</TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: 200 }}>
                    {delivery.lastError ?? '—'}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        )}
      </Table>
    </TableContainer>
  );
}
