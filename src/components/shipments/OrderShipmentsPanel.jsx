import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { Link as RouterLink } from 'react-router-dom';
import { DEFAULT_SHIPMENT_LIST_LIMIT } from '../../constants/shipmentCatalog.js';
import { useShipments } from '../../hooks/shipments/useShipmentQueries.js';
import { StatusBadge } from '../common/StatusBadge.jsx';
import { TableSkeleton } from '../tables/TableSkeleton.jsx';

/**
 * Compact shipments summary on order detail.
 * @param {{ orderId: string }} props
 */
export function OrderShipmentsPanel({ orderId }) {
  const { data, isLoading, isError } = useShipments({ orderId, limit: DEFAULT_SHIPMENT_LIST_LIMIT });

  const shipments = data?.items ?? [];

  return (
    <Paper className="mt-4 p-4">
      <Box className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <Typography variant="subtitle1">Shipments</Typography>
        <Box className="flex gap-2">
          <Button component={RouterLink} to={`/shipments?orderId=${orderId}`} size="small" variant="outlined">
            View all
          </Button>
          <Button
            component={RouterLink}
            to={`/orders/${orderId}/shipments/new`}
            size="small"
            variant="contained"
            startIcon={<AddIcon />}
          >
            Create shipment
          </Button>
        </Box>
      </Box>
      {isError ? (
        <Typography variant="body2" color="error">
          Unable to load shipments for this order.
        </Typography>
      ) : null}
      {isLoading ? <TableSkeleton columns={4} rows={2} /> : null}
      {!isLoading && !isError && shipments.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No shipments yet for this order.
        </Typography>
      ) : null}
      {!isLoading && shipments.length > 0 ? (
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Tracking</TableCell>
              <TableCell>Carrier</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {shipments.map((shipment) => (
              <TableRow key={shipment.id}>
                <TableCell>
                  <Typography
                    component={RouterLink}
                    to={`/shipments/${shipment.id}`}
                    variant="body2"
                    sx={{ color: 'primary.main', textDecoration: 'none' }}
                  >
                    {shipment.id.slice(0, 8)}…
                  </Typography>
                </TableCell>
                <TableCell>
                  <StatusBadge status={shipment.status} domain="shipment" />
                </TableCell>
                <TableCell>{shipment.trackingNumber ?? '—'}</TableCell>
                <TableCell>{shipment.carrier ?? '—'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : null}
    </Paper>
  );
}
