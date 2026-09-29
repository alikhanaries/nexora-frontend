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
import { StatusBadge } from '../common/StatusBadge.jsx';
import { TableSkeleton } from '../tables/TableSkeleton.jsx';
import { API_KEY_STATUS } from '../../constants/apiKeyCatalog.js';
import { formatDate } from '../../utils/formatDate.js';

/**
 * @param {{
 *   apiKeys: import('../../services/api/apiKeysService.js').ApiKeySummary[],
 *   isLoading: boolean,
 *   onRotate: (apiKey: import('../../services/api/apiKeysService.js').ApiKeySummary) => void,
 *   onRevoke: (apiKey: import('../../services/api/apiKeysService.js').ApiKeySummary) => void,
 *   actionsDisabled: boolean,
 * }} props
 */
export function ApiKeysTable({ apiKeys, isLoading, onRotate, onRevoke, actionsDisabled }) {
  const [menuAnchor, setMenuAnchor] = useState(
    /** @type {null | { el: HTMLElement, apiKey: import('../../services/api/apiKeysService.js').ApiKeySummary }} */ (null),
  );

  const closeMenu = () => setMenuAnchor(null);

  const formatOptionalDate = (value) => (value ? formatDate(value) : '—');

  return (
    <TableContainer component={Paper} className="overflow-x-auto">
      <Table size="small" aria-label="API keys">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Prefix</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Scopes</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Last used</TableCell>
            <TableCell>Expires</TableCell>
            <TableCell>Created</TableCell>
            <TableCell align="right" width={72}>
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        {isLoading ? (
          <TableSkeleton columns={9} />
        ) : (
          <TableBody>
            {apiKeys.map((apiKey) => {
              const canManage = apiKey.status === API_KEY_STATUS.ACTIVE;
              return (
                <TableRow key={apiKey.id} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight={500}>
                      {apiKey.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontFamily="monospace" color="text.secondary">
                      {apiKey.prefix}…
                    </Typography>
                  </TableCell>
                  <TableCell>{apiKey.keyType}</TableCell>
                  <TableCell>
                    <Tooltip title={apiKey.scopes.join(', ')}>
                      <Typography variant="body2" noWrap sx={{ maxWidth: 160 }}>
                        {apiKey.scopes.length} scope{apiKey.scopes.length === 1 ? '' : 's'}
                      </Typography>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={apiKey.status} domain="apiKey" />
                  </TableCell>
                  <TableCell>{formatOptionalDate(apiKey.lastUsedAt)}</TableCell>
                  <TableCell>{formatOptionalDate(apiKey.expiresAt)}</TableCell>
                  <TableCell>{formatDate(apiKey.createdAt, { dateStyle: 'medium', timeStyle: undefined })}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      aria-label={`Actions for ${apiKey.name}`}
                      disabled={!canManage || actionsDisabled}
                      onClick={(event) => setMenuAnchor({ el: event.currentTarget, apiKey })}
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
      <Menu anchorEl={menuAnchor?.el ?? null} open={Boolean(menuAnchor)} onClose={closeMenu}>
        <MenuItem
          onClick={() => {
            if (menuAnchor?.apiKey) onRotate(menuAnchor.apiKey);
            closeMenu();
          }}
        >
          Rotate key
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (menuAnchor?.apiKey) onRevoke(menuAnchor.apiKey);
            closeMenu();
          }}
        >
          Revoke key
        </MenuItem>
      </Menu>
    </TableContainer>
  );
}
