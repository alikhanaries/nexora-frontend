import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { StatusBadge } from '../common/StatusBadge.jsx';
import { TableSkeleton } from '../tables/TableSkeleton.jsx';
import { formatDate } from '../../utils/formatDate.js';

/**
 * @param {{
 *   roles: import('../../services/api/rolesService.js').Role[],
 *   isLoading: boolean,
 * }} props
 */
export function RolesTable({ roles, isLoading }) {
  return (
    <TableContainer component={Paper} className="overflow-x-auto">
      <Table size="small" aria-label="Tenant roles">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>System</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Permissions</TableCell>
            <TableCell>Updated</TableCell>
          </TableRow>
        </TableHead>
        {isLoading ? (
          <TableSkeleton columns={5} />
        ) : (
          <TableBody>
            {roles.map((role) => (
              <TableRow key={role.id} hover>
                <TableCell>
                  <Typography variant="body2">{role.name}</Typography>
                  {role.systemKey ? (
                    <Typography variant="caption" color="text.secondary" fontFamily="monospace">
                      {role.systemKey}
                    </Typography>
                  ) : null}
                </TableCell>
                <TableCell>{role.isSystem ? 'Yes' : 'No'}</TableCell>
                <TableCell>
                  <StatusBadge status={role.status} />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {role.permissionKeys.length} scope{role.permissionKeys.length === 1 ? '' : 's'}
                  </Typography>
                </TableCell>
                <TableCell>{formatDate(role.updatedAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        )}
      </Table>
    </TableContainer>
  );
}
