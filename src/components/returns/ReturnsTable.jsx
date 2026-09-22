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
 *   returns: import('../../services/api/returnsService.js').ReturnDetail[],
 *   isLoading: boolean,
 * }} props
 */
export function ReturnsTable({ returns, isLoading }) {
  const navigate = useNavigate();
  const [menuAnchor, setMenuAnchor] = useState(
    /** @type {null | { el: HTMLElement, item: import('../../services/api/returnsService.js').ReturnDetail }} */ (null),
  );

  return (
    <TableContainer component={Paper} className="overflow-x-auto">
      <Table size="small" aria-label="Returns">
        <TableHead>
          <TableRow>
            <TableCell>Return</TableCell>
            <TableCell>Order</TableCell>
            <TableCell>Shipment</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Lines</TableCell>
            <TableCell>Reason</TableCell>
            <TableCell>Created</TableCell>
            <TableCell align="right" width={72}>
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        {isLoading ? (
          <TableSkeleton columns={8} />
        ) : (
          <TableBody>
            {returns.map((item) => (
              <TableRow key={item.id} hover>
                <TableCell>
                  <Typography
                    component={RouterLink}
                    to={`/returns/${item.id}`}
                    variant="body2"
                    sx={{ fontFamily: 'monospace', fontSize: 12, color: 'primary.main', textDecoration: 'none' }}
                  >
                    {item.id.slice(0, 8)}…
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    component={RouterLink}
                    to={`/orders/${item.orderId}`}
                    variant="body2"
                    sx={{ fontFamily: 'monospace', fontSize: 12, color: 'primary.main', textDecoration: 'none' }}
                  >
                    {item.orderId.slice(0, 8)}…
                  </Typography>
                </TableCell>
                <TableCell>
                  {item.shipmentId ? (
                    <Typography
                      component={RouterLink}
                      to={`/shipments/${item.shipmentId}`}
                      variant="body2"
                      sx={{ fontFamily: 'monospace', fontSize: 12, color: 'primary.main', textDecoration: 'none' }}
                    >
                      {item.shipmentId.slice(0, 8)}…
                    </Typography>
                  ) : (
                    '—'
                  )}
                </TableCell>
                <TableCell>
                  <StatusBadge status={item.status} domain="return" />
                </TableCell>
                <TableCell>{item.lines?.length ?? 0}</TableCell>
                <TableCell>{item.reason ?? '—'}</TableCell>
                <TableCell>{formatDate(item.createdAt, { dateStyle: 'medium', timeStyle: 'short' })}</TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    aria-label="Return actions"
                    onClick={(event) => setMenuAnchor({ el: event.currentTarget, item })}
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
              navigate(`/returns/${menuAnchor.item.id}`);
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
