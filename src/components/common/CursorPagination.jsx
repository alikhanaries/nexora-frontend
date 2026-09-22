import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

/**
 * @param {{
 *   hasMore: boolean,
 *   canGoBack: boolean,
 *   onNext: () => void,
 *   onPrevious: () => void,
 *   isLoading?: boolean,
 *   itemCount?: number,
 * }} props
 */
export function CursorPagination({
  hasMore,
  canGoBack,
  onNext,
  onPrevious,
  isLoading = false,
  itemCount,
}) {
  return (
    <Box className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <Typography variant="body2" color="text.secondary">
        {typeof itemCount === 'number' ? `${itemCount} item(s) on this page` : null}
      </Typography>
      <Box className="flex gap-2">
        <Button variant="outlined" size="small" disabled={!canGoBack || isLoading} onClick={onPrevious}>
          Previous
        </Button>
        <Button variant="outlined" size="small" disabled={!hasMore || isLoading} onClick={onNext}>
          Next
        </Button>
      </Box>
    </Box>
  );
}
