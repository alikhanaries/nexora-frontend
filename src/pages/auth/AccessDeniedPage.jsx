import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

export function AccessDeniedPage() {
  const navigate = useNavigate();

  return (
    <Box className="flex min-h-[50vh] items-center justify-center p-4">
      <Paper className="max-w-md p-6 text-center" elevation={0} variant="outlined">
        <Typography variant="h6" component="h1" gutterBottom>
          Access denied
        </Typography>
        <Typography variant="body2" color="text.secondary" className="mb-4">
          You are signed in, but your account does not have permission to open this page. If you believe this is a
          mistake, contact your tenant administrator.
        </Typography>
        <Box className="flex flex-wrap justify-center gap-2">
          <Button startIcon={<ArrowBackIcon />} variant="outlined" size="small" onClick={() => navigate(-1)}>
            Go back
          </Button>
          <Button component={RouterLink} to="/orders" startIcon={<HomeOutlinedIcon />} variant="contained" size="small">
            Go to orders
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
