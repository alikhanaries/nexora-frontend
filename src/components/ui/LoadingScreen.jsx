import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

export function LoadingScreen({ message = 'Loading…' }) {
  return (
    <Box
      className="flex min-h-[40vh] flex-col items-center justify-center gap-3"
      role="status"
      aria-live="polite"
    >
      <CircularProgress size={32} aria-hidden />
      <Typography variant="body2" color="text.secondary">
        {message}
      </Typography>
    </Box>
  );
}
