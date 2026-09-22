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
import { PRICE_STATUS } from '../../constants/priceCatalog.js';
import { StatusBadge } from '../common/StatusBadge.jsx';
import { TableSkeleton } from '../tables/TableSkeleton.jsx';
import { formatDate } from '../../utils/formatDate.js';
import { formatMoneyMinor } from '../../utils/money.js';

/**
 * @param {{
 *   prices: import('../../services/api/pricingService.js').Price[],
 *   isLoading: boolean,
 *   onDeactivate: (price: import('../../services/api/pricingService.js').Price) => void,
 * }} props
 */
export function PricingTable({ prices, isLoading, onDeactivate }) {
  const navigate = useNavigate();
  const [menuAnchor, setMenuAnchor] = useState(
    /** @type {null | { el: HTMLElement, price: import('../../services/api/pricingService.js').Price }} */ (null),
  );

  return (
    <TableContainer component={Paper} className="overflow-x-auto">
      <Table size="small" aria-label="Pricing">
        <TableHead>
          <TableRow>
            <TableCell>Product</TableCell>
            <TableCell align="right">Amount</TableCell>
            <TableCell>Currency</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Valid from</TableCell>
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
            {prices.map((price) => (
              <TableRow key={price.id} hover>
                <TableCell>
                  <Typography
                    component={RouterLink}
                    to={`/products/${price.productId}`}
                    variant="body2"
                    sx={{ fontFamily: 'monospace', fontSize: 12, color: 'primary.main', textDecoration: 'none' }}
                  >
                    {price.productId}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography
                    component={RouterLink}
                    to={`/pricing/${price.id}`}
                    variant="body2"
                    fontWeight={500}
                    sx={{ color: 'text.primary', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                  >
                    {formatMoneyMinor(price.amountMinor, price.currency)}
                  </Typography>
                </TableCell>
                <TableCell>{price.currency}</TableCell>
                <TableCell>
                  <StatusBadge status={price.status} domain="pricing" />
                </TableCell>
                <TableCell>{formatDate(price.validFrom, { dateStyle: 'medium', timeStyle: 'short' })}</TableCell>
                <TableCell>{formatDate(price.updatedAt, { dateStyle: 'medium', timeStyle: undefined })}</TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    aria-label="Price actions"
                    onClick={(event) => setMenuAnchor({ el: event.currentTarget, price })}
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
              navigate(`/pricing/${menuAnchor.price.id}`);
              setMenuAnchor(null);
            }}
          >
            View
          </MenuItem>
          <MenuItem
            onClick={() => {
              navigate(`/pricing/${menuAnchor.price.id}/edit`);
              setMenuAnchor(null);
            }}
          >
            Edit
          </MenuItem>
          {menuAnchor.price.status === PRICE_STATUS.ACTIVE ? (
            <MenuItem
              onClick={() => {
                onDeactivate(menuAnchor.price);
                setMenuAnchor(null);
              }}
            >
              Deactivate
            </MenuItem>
          ) : null}
        </Menu>
      ) : null}
    </TableContainer>
  );
}
