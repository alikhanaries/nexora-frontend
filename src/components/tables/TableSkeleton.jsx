import Skeleton from '@mui/material/Skeleton';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

/**
 * @param {{ columns: number, rows?: number }} props
 */
export function TableSkeleton({ columns, rows = 8 }) {
  return (
    <TableBody>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <TableRow key={rowIndex}>
          {Array.from({ length: columns }).map((__, colIndex) => (
            <TableCell key={colIndex}>
              <Skeleton variant="text" animation="wave" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  );
}
