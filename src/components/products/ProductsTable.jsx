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
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { StatusBadge } from '../common/StatusBadge.jsx';
import { TableSkeleton } from '../tables/TableSkeleton.jsx';
import { formatDate } from '../../utils/formatDate.js';

/**
 * @param {{
 *   products: import('../../services/api/productsService.js').Product[],
 *   isLoading: boolean,
 *   onDeactivate: (product: import('../../services/api/productsService.js').Product) => void,
 *   onArchive: (product: import('../../services/api/productsService.js').Product) => void,
 * }} props
 */
export function ProductsTable({ products, isLoading, onDeactivate, onArchive }) {
  const navigate = useNavigate();
  const [menuAnchor, setMenuAnchor] = useState(/** @type {null | { el: HTMLElement, product: import('../../services/api/productsService.js').Product }} */ (null));

  const closeMenu = () => setMenuAnchor(null);

  return (
    <TableContainer component={Paper} className="overflow-x-auto">
      <Table size="small" aria-label="Products">
        <TableHead>
          <TableRow>
            <TableCell>SKU</TableCell>
            <TableCell>External reference</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Updated</TableCell>
            <TableCell align="right" width={72}>
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        {isLoading ? (
          <TableSkeleton columns={6} />
        ) : (
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id} hover>
                <TableCell>
                  <Tooltip title={product.merchantSku}>
                    <Typography
                      component={RouterLink}
                      to={`/products/${product.id}`}
                      variant="body2"
                      fontWeight={500}
                      sx={{ color: 'primary.main', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                    >
                      {product.merchantSku}
                    </Typography>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: 200 }}>
                    {product.externalReference ?? '—'}
                  </Typography>
                </TableCell>
                <TableCell>{product.productType}</TableCell>
                <TableCell>
                  <StatusBadge status={product.status} />
                </TableCell>
                <TableCell>{formatDate(product.updatedAt, { dateStyle: 'medium', timeStyle: undefined })}</TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    aria-label={`Actions for ${product.merchantSku}`}
                    onClick={(event) => setMenuAnchor({ el: event.currentTarget, product })}
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
        <Menu anchorEl={menuAnchor.el} open onClose={closeMenu}>
          <MenuItem
            onClick={() => {
              navigate(`/products/${menuAnchor.product.id}`);
              closeMenu();
            }}
          >
            View details
          </MenuItem>
          <MenuItem
            onClick={() => {
              navigate(`/products/${menuAnchor.product.id}/edit`);
              closeMenu();
            }}
          >
            Edit
          </MenuItem>
          {menuAnchor.product.status === 'ACTIVE' ? (
            <MenuItem
              onClick={() => {
                onDeactivate(menuAnchor.product);
                closeMenu();
              }}
            >
              Deactivate
            </MenuItem>
          ) : null}
          {menuAnchor.product.status !== 'ARCHIVED' ? (
            <MenuItem
              onClick={() => {
                onArchive(menuAnchor.product);
                closeMenu();
              }}
            >
              Archive
            </MenuItem>
          ) : null}
        </Menu>
      ) : null}
    </TableContainer>
  );
}
