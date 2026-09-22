import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export function EmptyState({ title = 'No data yet', description, action }) {
  return (
    <Box
      className="flex flex-col items-center justify-center gap-2 py-12 text-center"
      role="status"
    >
      <Typography variant="subtitle1" color="text.primary">
        {title}
      </Typography>
      {description ? (
        <Typography variant="body2" color="text.secondary" className="max-w-md">
          {description}
        </Typography>
      ) : null}
      {action ? <Box sx={{ mt: 2 }}>{action}</Box> : null}
    </Box>
  );
}
