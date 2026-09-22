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
import { useMemo, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { StatusBadge } from '../common/StatusBadge.jsx';
import { TableSkeleton } from '../tables/TableSkeleton.jsx';
import { formatDate } from '../../utils/formatDate.js';
import { formatMarketplaceLabel } from '../../utils/marketplaceLabel.js';

/**
 * @param {{
 *   channels: import('../../services/api/channelsService.js').Channel[],
 *   marketplaces: import('../../services/api/marketplacesService.js').Marketplace[] | undefined,
 *   isLoading: boolean,
 * }} props
 */
export function ChannelsTable({ channels, marketplaces, isLoading }) {
  const navigate = useNavigate();
  const [menuAnchor, setMenuAnchor] = useState(
    /** @type {null | { el: HTMLElement, channel: import('../../services/api/channelsService.js').Channel }} */ (null),
  );

  const marketplaceList = useMemo(() => marketplaces ?? [], [marketplaces]);
  const closeMenu = () => setMenuAnchor(null);

  return (
    <TableContainer component={Paper} className="overflow-x-auto">
      <Table size="small" aria-label="Channels">
        <TableHead>
          <TableRow>
            <TableCell>Channel</TableCell>
            <TableCell>Marketplace</TableCell>
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
            {channels.map((channel) => (
              <TableRow key={channel.id} hover>
                <TableCell>
                  <Tooltip title={channel.name}>
                    <Typography
                      component={RouterLink}
                      to={`/channels/${channel.id}`}
                      variant="body2"
                      fontWeight={500}
                      sx={{
                        color: 'primary.main',
                        textDecoration: 'none',
                        '&:hover': { textDecoration: 'underline' },
                      }}
                    >
                      {channel.name}
                    </Typography>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: 220 }}>
                    {formatMarketplaceLabel(marketplaceList, channel.marketplaceId)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <StatusBadge status={channel.status} domain="channel" />
                </TableCell>
                <TableCell>{formatDate(channel.createdAt, { dateStyle: 'medium', timeStyle: undefined })}</TableCell>
                <TableCell>{formatDate(channel.updatedAt, { dateStyle: 'medium', timeStyle: undefined })}</TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    aria-label={`Actions for ${channel.name}`}
                    onClick={(event) => setMenuAnchor({ el: event.currentTarget, channel })}
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
            if (menuAnchor?.channel) navigate(`/channels/${menuAnchor.channel.id}`);
            closeMenu();
          }}
        >
          View details
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (menuAnchor?.channel) navigate(`/channels/${menuAnchor.channel.id}/edit`);
            closeMenu();
          }}
        >
          Edit
        </MenuItem>
      </Menu>
    </TableContainer>
  );
}
