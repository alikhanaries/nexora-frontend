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
import { WEBHOOK_SUBSCRIPTION_STATUS } from '../../constants/webhookCatalog.js';
import { formatDate } from '../../utils/formatDate.js';

/**
 * @param {{
 *   webhooks: import('../../services/api/webhooksService.js').WebhookSubscription[],
 *   isLoading: boolean,
 * }} props
 */
export function WebhooksTable({ webhooks, isLoading }) {
  const navigate = useNavigate();
  const [menuAnchor, setMenuAnchor] = useState(
    /** @type {null | { el: HTMLElement, webhook: import('../../services/api/webhooksService.js').WebhookSubscription }} */ (null),
  );

  const closeMenu = () => setMenuAnchor(null);

  return (
    <TableContainer component={Paper} className="overflow-x-auto">
      <Table size="small" aria-label="Webhooks">
        <TableHead>
          <TableRow>
            <TableCell>Endpoint</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Events</TableCell>
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
            {webhooks.map((webhook) => (
              <TableRow key={webhook.id} hover>
                <TableCell>
                  <Tooltip title={webhook.url}>
                    <Typography
                      component={RouterLink}
                      to={`/webhooks/${webhook.id}`}
                      variant="body2"
                      fontWeight={500}
                      sx={{
                        color: 'primary.main',
                        textDecoration: 'none',
                        '&:hover': { textDecoration: 'underline' },
                        display: 'block',
                        maxWidth: 280,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {webhook.url}
                    </Typography>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: 200 }}>
                    {webhook.description ?? '—'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Tooltip title={webhook.eventTypes.join(', ')}>
                    <Typography variant="body2">{webhook.eventTypes.length} events</Typography>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <StatusBadge status={webhook.status} domain="webhook" />
                </TableCell>
                <TableCell>{formatDate(webhook.updatedAt, { dateStyle: 'medium', timeStyle: undefined })}</TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    aria-label={`Actions for webhook ${webhook.id}`}
                    disabled={webhook.status === WEBHOOK_SUBSCRIPTION_STATUS.DELETED}
                    onClick={(event) => setMenuAnchor({ el: event.currentTarget, webhook })}
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
            if (menuAnchor?.webhook) navigate(`/webhooks/${menuAnchor.webhook.id}`);
            closeMenu();
          }}
        >
          View details
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (menuAnchor?.webhook) navigate(`/webhooks/${menuAnchor.webhook.id}/edit`);
            closeMenu();
          }}
        >
          Edit
        </MenuItem>
      </Menu>
    </TableContainer>
  );
}
