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

/**
 * @param {{
 *   shipments: import('../../services/api/shipmentsService.js').ShipmentSummary[],
 *   isLoading: boolean,
 * }} props
 */
export function ShipmentsTable({ shipments, isLoading }) {
  const navigate = useNavigate();
  const [menuAnchor, setMenuAnchor] = useState(
    /** @type {null | { el: HTMLElement, shipment: import('../../services/api/shipmentsService.js').ShipmentSummary }} */ (null),
  );

  return (
    <TableContainer component={Paper} className="overflow-x-auto">
      <Table size="small" aria-label="Shipments">
        <TableHead>
          <TableRow>
            <TableCell>Shipment</TableCell>
            <TableCell>Order</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Carrier</TableCell>
            <TableCell>Tracking</TableCell>
            <TableCell>Shipped</TableCell>
            <TableCell align="right" width={72}>
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        {isLoading ? (
          <TableSkeleton columns={7} />
        ) : (
          <TableBody>
            {shipments.map((shipment) => (
              <TableRow key={shipment.id} hover>
                <TableCell>
                  <Typography
                    component={RouterLink}
                    to={`/shipments/${shipment.id}`}
                    variant="body2"
                    sx={{ fontFamily: 'monospace', fontSize: 12, color: 'primary.main', textDecoration: 'none' }}
                  >
                    {shipment.id.slice(0, 8)}…
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    component={RouterLink}
                    to={`/orders/${shipment.orderId}`}
                    variant="body2"
                    sx={{ fontFamily: 'monospace', fontSize: 12, color: 'primary.main', textDecoration: 'none' }}
                  >
                    {shipment.orderId.slice(0, 8)}…
                  </Typography>
                </TableCell>
                <TableCell>
                  <StatusBadge status={shipment.status} domain="shipment" />
                </TableCell>
                <TableCell>{shipment.carrier ?? '—'}</TableCell>
                <TableCell>{shipment.trackingNumber ?? '—'}</TableCell>
                <TableCell>
                  {shipment.shippedAt ? formatDate(shipment.shippedAt, { dateStyle: 'medium', timeStyle: 'short' }) : '—'}
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    aria-label="Shipment actions"
                    onClick={(event) => setMenuAnchor({ el: event.currentTarget, shipment })}
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
              navigate(`/shipments/${menuAnchor.shipment.id}`);
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
