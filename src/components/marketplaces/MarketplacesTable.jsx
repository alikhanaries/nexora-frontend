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
 *   marketplaces: import('../../services/api/marketplacesService.js').Marketplace[],
 *   isLoading: boolean,
 * }} props
 */
export function MarketplacesTable({ marketplaces, isLoading }) {
  const navigate = useNavigate();
  const [menuAnchor, setMenuAnchor] = useState(
    /** @type {null | { el: HTMLElement, marketplace: import('../../services/api/marketplacesService.js').Marketplace }} */ (null),
  );

  const closeMenu = () => setMenuAnchor(null);

  return (
    <TableContainer component={Paper} className="overflow-x-auto">
      <Table size="small" aria-label="Marketplaces">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Key</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Created</TableCell>
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
            {marketplaces.map((marketplace) => (
              <TableRow key={marketplace.id} hover>
                <TableCell>
                  <Tooltip title={marketplace.name}>
                    <Typography
                      component={RouterLink}
                      to={`/marketplaces/${marketplace.id}`}
                      variant="body2"
                      fontWeight={500}
                      sx={{
                        color: 'primary.main',
                        textDecoration: 'none',
                        '&:hover': { textDecoration: 'underline' },
                      }}
                    >
                      {marketplace.name}
                    </Typography>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary" fontFamily="monospace">
                    {marketplace.key}
                  </Typography>
                </TableCell>
                <TableCell>
                  <StatusBadge status={marketplace.status} domain="marketplace" />
                </TableCell>
                <TableCell>{formatDate(marketplace.createdAt, { dateStyle: 'medium', timeStyle: undefined })}</TableCell>
                <TableCell>{formatDate(marketplace.updatedAt, { dateStyle: 'medium', timeStyle: undefined })}</TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    aria-label={`Actions for ${marketplace.name}`}
                    onClick={(event) => setMenuAnchor({ el: event.currentTarget, marketplace })}
                  >
                    <MoreVertIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        )}
      </Table>
      <Menu anchorEl={menuAnchor?.el ?? null} open={Boolean(menuAnchor)} onClose={closeMenu}>
        <MenuItem
          onClick={() => {
            if (menuAnchor?.marketplace) navigate(`/marketplaces/${menuAnchor.marketplace.id}`);
            closeMenu();
          }}
        >
          View details
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (menuAnchor?.marketplace) navigate(`/marketplaces/${menuAnchor.marketplace.id}/edit`);
            closeMenu();
          }}
        >
          Edit
        </MenuItem>
      </Menu>
    </TableContainer>
  );
}
