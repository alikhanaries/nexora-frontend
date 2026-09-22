import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { Outlet } from 'react-router-dom';

/**
 * Minimal shell — navigation and module chrome arrive in later phases.
 */
export function AppLayout() {
  return (
    <Box className="min-h-screen">
      <Box
        component="header"
        className="border-b border-[#e0e4e8] bg-white px-4 py-3"
        sx={{ borderColor: 'divider' }}
      >
        <Container maxWidth="lg" disableGutters>
          <Typography variant="h3" component="span" color="text.primary">
            Nexora
          </Typography>
        </Container>
      </Box>
      <Container maxWidth="lg" className="py-6">
        <Outlet />
      </Container>
    </Box>
  );
}
