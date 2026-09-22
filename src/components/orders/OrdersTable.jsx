import MoreVertIcon from '@mui/icons-material/MoreVert';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { StatusBadge } from '../common/StatusBadge.jsx';
import { TableSkeleton } from '../tables/TableSkeleton.jsx';
import { formatDate } from '../../utils/formatDate.js';
import { formatMoneyMinor } from '../../utils/money.js';

/**
 * @param {{
 *   orders: import('../../services/api/ordersService.js').OrderSummary[],
 *   isLoading: boolean,
 *   channelNameById: Record<string, string>,
 * }} props
 */
export function OrdersTable({ orders, isLoading, channelNameById }) {
  const navigate = useNavigate();
  const [menuAnchor, setMenuAnchor] = useState(
    /** @type {null | { el: HTMLElement, order: import('../../services/api/ordersService.js').OrderSummary }} */ (null),
  );

  return (
    <TableContainer component={Paper} className="overflow-x-auto">
      <Table size="small" aria-label="Orders">
        <TableHead>
          <TableRow>
            <TableCell>Order #</TableCell>
            <TableCell>External ref</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Channel</TableCell>
            <TableCell align="right">Total</TableCell>
            <TableCell>Created</TableCell>
            <TableCell align="right" width={72}>
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        {isLoading ? (
          <TableSkeleton columns={7} />
        ) : (
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id} hover>
                <TableCell>
                  <Typography
                    component={RouterLink}
                    to={`/orders/${order.id}`}
                    variant="body2"
                    fontWeight={500}
                    sx={{ color: 'primary.main', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                  >
                    {order.orderNumber}
                  </Typography>
                </TableCell>
                <TableCell>{order.externalOrderReference ?? '—'}</TableCell>
                <TableCell>
                  <StatusBadge status={order.status} domain="order" />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" title={order.channelId}>
                    {channelNameById[order.channelId] ?? order.channelId}
                  </Typography>
                </TableCell>
                <TableCell align="right">{formatMoneyMinor(order.totalMinor, order.currency)}</TableCell>
                <TableCell>{formatDate(order.createdAt, { dateStyle: 'medium', timeStyle: 'short' })}</TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    aria-label="Order actions"
                    onClick={(event) => setMenuAnchor({ el: event.currentTarget, order })}
                  >
                    <MoreVertIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        )}
      </Table>
      {menuAnchor ? (
        <Menu anchorEl={menuAnchor.el} open onClose={() => setMenuAnchor(null)}>
          <MenuItem
            onClick={() => {
              navigate(`/orders/${menuAnchor.order.id}`);
              setMenuAnchor(null);
            }}
          >
            View
          </MenuItem>
        </Menu>
      ) : null}
    </TableContainer>
  );
}
