import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { getUserFacingMessage } from '../../services/api/apiError.js';

export function ErrorState({ error, title = 'Something went wrong', onRetry }) {
  const message = error ? getUserFacingMessage(error) : title;

  return (
    <Box className="flex flex-col items-start gap-3 py-8">
      <Alert severity="error" variant="outlined" className="w-full max-w-lg">
        <Typography variant="subtitle2" component="div" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2">{message}</Typography>
        {error?.requestId ? (
          <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
            Reference: {error.requestId}
          </Typography>
        ) : null}
      </Alert>
      {onRetry ? (
        <Button variant="outlined" size="small" onClick={onRetry}>
          Try again
        </Button>
      ) : null}
    </Box>
  );
}
