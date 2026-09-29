import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
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
import { TableSkeleton } from '../tables/TableSkeleton.jsx';
import { formatAuditEventLabel } from '../../constants/auditEventPresentation.js';
import { formatAuditMetadataSummary } from '../../utils/auditMetadataDisplay.js';
import { copyToClipboard } from '../../utils/copyToClipboard.js';
import { formatDate } from '../../utils/formatDate.js';

/**
 * @param {{
 *   events: import('../../services/api/auditService.js').AuditEvent[],
 *   isLoading: boolean,
 * }} props
 */
export function AuditEventsTable({ events, isLoading }) {
  const [copiedRequestId, setCopiedRequestId] = useState('');

  const handleCopyRequestId = async (requestId) => {
    const ok = await copyToClipboard(requestId);
    if (ok) {
      setCopiedRequestId(requestId);
      window.setTimeout(() => setCopiedRequestId(''), 2000);
    }
  };

  return (
    <TableContainer component={Paper} className="overflow-x-auto">
      <Table size="small" aria-label="Audit events">
        <TableHead>
          <TableRow>
            <TableCell>Event</TableCell>
            <TableCell>Actor</TableCell>
            <TableCell>Resource</TableCell>
            <TableCell>Metadata</TableCell>
            <TableCell>IP</TableCell>
            <TableCell>Request ID</TableCell>
            <TableCell>Created</TableCell>
          </TableRow>
        </TableHead>
        {isLoading ? (
          <TableSkeleton columns={7} />
        ) : (
          <TableBody>
            {events.map((event) => {
              const metadataSummary = formatAuditMetadataSummary(event.metadata);
              return (
                <TableRow key={event.id} hover>
                  <TableCell>
                    <Tooltip title={event.eventType}>
                      <Typography variant="body2" fontWeight={500}>
                        {formatAuditEventLabel(event.eventType)}
                      </Typography>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{event.actorKind}</Typography>
                    <Typography variant="caption" color="text.secondary" noWrap sx={{ maxWidth: 160, display: 'block' }}>
                      {event.actorId ?? '—'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{event.resourceType ?? '—'}</Typography>
                    <Typography variant="caption" color="text.secondary" noWrap sx={{ maxWidth: 160, display: 'block' }}>
                      {event.resourceId ?? '—'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Tooltip title={metadataSummary}>
                      <Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: 200 }}>
                        {metadataSummary}
                      </Typography>
                    </Tooltip>
                  </TableCell>
                  <TableCell>{event.ipAddress ?? '—'}</TableCell>
                  <TableCell>
                    {event.requestId ? (
                      <Box className="flex items-center gap-0.5">
                        <Typography variant="caption" fontFamily="monospace" noWrap sx={{ maxWidth: 100 }}>
                          {event.requestId.slice(0, 8)}…
                        </Typography>
                        <Tooltip title={copiedRequestId === event.requestId ? 'Copied' : 'Copy request ID'}>
                          <IconButton
                            size="small"
                            aria-label="Copy request ID"
                            onClick={() => handleCopyRequestId(event.requestId)}
                          >
                            <ContentCopyIcon sx={{ fontSize: 14 }} />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    ) : (
                      '—'
                    )}
                  </TableCell>
                  <TableCell>{formatDate(event.createdAt, { dateStyle: 'medium', timeStyle: 'short' })}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        )}
      </Table>
    </TableContainer>
  );
}
