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
import { OFFER_STATUS } from '../../constants/offerCatalog.js';
import { formatDate } from '../../utils/formatDate.js';
import { StatusBadge } from '../common/StatusBadge.jsx';
import { TableSkeleton } from '../tables/TableSkeleton.jsx';

/**
 * @param {{
 *   offers: import('../../services/api/offersService.js').Offer[],
 *   isLoading: boolean,
 *   channelNameById: Record<string, string>,
 *   onActivate: (offer: import('../../services/api/offersService.js').Offer) => void,
 *   onSuspend: (offer: import('../../services/api/offersService.js').Offer) => void,
 *   onDeactivate: (offer: import('../../services/api/offersService.js').Offer) => void,
 * }} props
 */
export function OffersTable({
  offers,
  isLoading,
  channelNameById,
  onActivate,
  onSuspend,
  onDeactivate,
}) {
  const navigate = useNavigate();
  const [menuAnchor, setMenuAnchor] = useState(
    /** @type {null | { el: HTMLElement, offer: import('../../services/api/offersService.js').Offer }} */ (null),
  );

  const resolveChannelLabel = (channelId) => {
    const name = channelNameById[channelId];
    return name ? `${name}` : channelId;
  };

  return (
    <TableContainer component={Paper} className="overflow-x-auto">
      <Table size="small" aria-label="Offers">
        <TableHead>
          <TableRow>
            <TableCell>Product</TableCell>
            <TableCell>Channel</TableCell>
            <TableCell>Price ref</TableCell>
            <TableCell>Lifecycle</TableCell>
            <TableCell>Listing</TableCell>
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
            {offers.map((offer) => (
              <TableRow key={offer.id} hover>
                <TableCell>
                  <Typography
                    component={RouterLink}
                    to={`/products/${offer.productId}`}
                    variant="body2"
                    sx={{ fontFamily: 'monospace', fontSize: 12, color: 'primary.main', textDecoration: 'none' }}
                  >
                    {offer.productId}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" title={offer.channelId}>
                    {resolveChannelLabel(offer.channelId)}
                  </Typography>
                </TableCell>
                <TableCell>
                  {offer.priceReference ? (
                    <Typography
                      component={RouterLink}
                      to={`/pricing/${offer.priceReference}`}
                      variant="body2"
                      sx={{ fontFamily: 'monospace', fontSize: 12, color: 'primary.main', textDecoration: 'none' }}
                    >
                      {offer.priceReference}
                    </Typography>
                  ) : (
                    '—'
                  )}
                </TableCell>
                <TableCell>
                  <StatusBadge status={offer.status} domain="offer" />
                </TableCell>
                <TableCell>
                  <StatusBadge status={offer.listingStatus} domain="listing" />
                </TableCell>
                <TableCell>{formatDate(offer.updatedAt, { dateStyle: 'medium', timeStyle: undefined })}</TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    aria-label="Offer actions"
                    onClick={(event) => setMenuAnchor({ el: event.currentTarget, offer })}
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
              navigate(`/offers/${menuAnchor.offer.id}`);
              setMenuAnchor(null);
            }}
          >
            View
          </MenuItem>
          {menuAnchor.offer.status !== OFFER_STATUS.INACTIVE ? (
            <MenuItem
              onClick={() => {
                navigate(`/offers/${menuAnchor.offer.id}/edit`);
                setMenuAnchor(null);
              }}
            >
              Edit
            </MenuItem>
          ) : null}
          {menuAnchor.offer.status === OFFER_STATUS.DRAFT ||
          menuAnchor.offer.status === OFFER_STATUS.SUSPENDED ? (
            <MenuItem
              onClick={() => {
                onActivate(menuAnchor.offer);
                setMenuAnchor(null);
              }}
            >
              Activate
            </MenuItem>
          ) : null}
          {menuAnchor.offer.status === OFFER_STATUS.ACTIVE ? (
            <MenuItem
              onClick={() => {
                onSuspend(menuAnchor.offer);
                setMenuAnchor(null);
              }}
            >
              Suspend
            </MenuItem>
          ) : null}
          {menuAnchor.offer.status !== OFFER_STATUS.INACTIVE ? (
            <MenuItem
              onClick={() => {
                onDeactivate(menuAnchor.offer);
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
