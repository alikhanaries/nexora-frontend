import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

/**
 * @param {{
 *   total: number,
 *   limit: number,
 *   offset: number,
 *   onPrevious: () => void,
 *   onNext: () => void,
 *   isLoading?: boolean,
 * }} props
 */
export function OffsetPagination({ total, limit, offset, onPrevious, onNext, isLoading = false }) {
  const safeLimit = limit > 0 ? limit : 1;
  const start = total === 0 ? 0 : offset + 1;
  const end = Math.min(offset + safeLimit, total);
  const canGoBack = offset > 0;
  const canGoForward = offset + safeLimit < total;
  const page = Math.floor(offset / safeLimit) + 1;
  const totalPages = Math.max(1, Math.ceil(total / safeLimit));

  return (
    <Box className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <Typography variant="body2" color="text.secondary">
        {total === 0
          ? 'No results'
          : `Showing ${start}–${end} of ${total} (page ${page} of ${totalPages})`}
      </Typography>
      <Box className="flex gap-2">
        <Button variant="outlined" size="small" disabled={!canGoBack || isLoading} onClick={onPrevious}>
          Previous
        </Button>
        <Button variant="outlined" size="small" disabled={!canGoForward || isLoading} onClick={onNext}>
          Next
        </Button>
      </Box>
    </Box>
  );
}
