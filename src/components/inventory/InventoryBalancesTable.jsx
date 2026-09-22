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
import { useMemo, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { TableSkeleton } from '../tables/TableSkeleton.jsx';
import { formatDate } from '../../utils/formatDate.js';
import { formatQuantity } from '../../utils/formatQuantity.js';

/**
 * @param {{
 *   balances: import('../../services/api/inventoryService.js').InventoryBalance[],
 *   locationsById: Record<string, import('../../services/api/inventoryService.js').StockLocation>,
 *   isLoading: boolean,
 *   onOperation: (operation: string, balance: import('../../services/api/inventoryService.js').InventoryBalance) => void,
 * }} props
 */
export function InventoryBalancesTable({ balances, locationsById, isLoading, onOperation }) {
  const [menuAnchor, setMenuAnchor] = useState(
    /** @type {null | { el: HTMLElement, balance: import('../../services/api/inventoryService.js').InventoryBalance }} */ (null),
  );

  const operations = useMemo(
    () => [
      { id: 'adjust', label: 'Adjust quantity' },
      { id: 'receive', label: 'Receive stock' },
      { id: 'reserve', label: 'Reserve' },
      { id: 'release', label: 'Release reservation' },
    ],
    [],
  );

  return (
    <TableContainer component={Paper} className="overflow-x-auto">
      <Table size="small" aria-label="Inventory balances">
        <TableHead>
          <TableRow>
            <TableCell>Product ID</TableCell>
            <TableCell>Location</TableCell>
            <TableCell align="right">On hand</TableCell>
            <TableCell align="right">Reserved</TableCell>
            <TableCell align="right">Available</TableCell>
            <TableCell>Updated</TableCell>
            <TableCell align="right" width={72}>
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        {isLoading ? (
          <TableSkeleton columns={7} />
        ) : (
          <TableBody>
            {balances.map((balance) => {
              const location = locationsById[balance.stockLocationId];
              return (
                <TableRow key={balance.id} hover>
                  <TableCell>
                    <Typography
                      component={RouterLink}
                      to={`/products/${balance.productId}`}
                      variant="body2"
                      sx={{ color: 'primary.main', textDecoration: 'none', fontFamily: 'monospace', fontSize: 12 }}
                    >
                      {balance.productId}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{location?.name ?? balance.stockLocationId}</Typography>
                  </TableCell>
                  <TableCell align="right">{formatQuantity(balance.onHand)}</TableCell>
                  <TableCell align="right">{formatQuantity(balance.reserved)}</TableCell>
                  <TableCell align="right">{formatQuantity(balance.available)}</TableCell>
                  <TableCell>
                    {formatDate(balance.updatedAt, { dateStyle: 'medium', timeStyle: undefined })}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      aria-label="Inventory operations"
                      onClick={(event) => setMenuAnchor({ el: event.currentTarget, balance })}
                    >
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        )}
      </Table>
      {menuAnchor ? (
        <Menu anchorEl={menuAnchor.el} open onClose={() => setMenuAnchor(null)}>
          {operations.map((operation) => (
            <MenuItem
              key={operation.id}
              onClick={() => {
                onOperation(operation.id, menuAnchor.balance);
                setMenuAnchor(null);
              }}
            >
              {operation.label}
            </MenuItem>
          ))}
        </Menu>
      ) : null}
    </TableContainer>
  );
}
