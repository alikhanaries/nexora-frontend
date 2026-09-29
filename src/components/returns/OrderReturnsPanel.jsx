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
import { DEFAULT_RETURN_LIST_LIMIT } from '../../constants/returnCatalog.js';
import { useReturns } from '../../hooks/returns/useReturnQueries.js';
import { StatusBadge } from '../common/StatusBadge.jsx';
import { TableSkeleton } from '../tables/TableSkeleton.jsx';
import { formatDate } from '../../utils/formatDate.js';

/**
 * @param {{ orderId: string }} props
 */
export function OrderReturnsPanel({ orderId }) {
  const { data, isLoading, isError } = useReturns({ orderId, limit: DEFAULT_RETURN_LIST_LIMIT });
  const returns = data?.items ?? [];

  return (
    <Paper className="mt-4 p-4">
      <Box className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <Typography variant="subtitle1">Returns</Typography>
        <Box className="flex gap-2">
          <Button component={RouterLink} to={`/returns?orderId=${orderId}`} size="small" variant="outlined">
            View all
          </Button>
          <Button
            component={RouterLink}
            to={`/orders/${orderId}/returns/new`}
            size="small"
            variant="contained"
            startIcon={<AddIcon />}
          >
            Create return
          </Button>
        </Box>
      </Box>
      {isError ? (
        <Typography variant="body2" color="error">
          Unable to load returns for this order.
        </Typography>
      ) : null}
      {isLoading ? <TableSkeleton columns={4} rows={2} /> : null}
      {!isLoading && !isError && returns.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No returns yet for this order.
        </Typography>
      ) : null}
      {!isLoading && returns.length > 0 ? (
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Return</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Lines</TableCell>
              <TableCell>Created</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {returns.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <Typography
                    component={RouterLink}
                    to={`/returns/${item.id}`}
                    variant="body2"
                    sx={{ color: 'primary.main', textDecoration: 'none' }}
                  >
                    {item.id.slice(0, 8)}…
                  </Typography>
                </TableCell>
                <TableCell>
                  <StatusBadge status={item.status} domain="return" />
                </TableCell>
                <TableCell>{item.lines?.length ?? 0}</TableCell>
                <TableCell>{formatDate(item.createdAt, { dateStyle: 'medium', timeStyle: undefined })}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : null}
    </Paper>
  );
}
