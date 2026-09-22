import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

/**
 * @param {{ title: string, description?: string, action?: import('react').ReactNode }} props
 */
export function PageHeader({ title, description, action }) {
  return (
    <Box className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <Box className="min-w-0">
        <Typography variant="h2" component="h1" gutterBottom={Boolean(description)}>
          {title}
        </Typography>
        {description ? (
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        ) : null}
      </Box>
      {action ? <Box className="flex shrink-0 items-center gap-2">{action}</Box> : null}
    </Box>
  );
}
