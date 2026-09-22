import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import { Outlet } from 'react-router-dom';

export function AuthLayout() {
  return (
    <Box className="flex min-h-screen items-center justify-center px-4 py-8">
      <Container maxWidth="sm" disableGutters>
        <Paper className="w-full px-6 py-8 sm:px-8">
          <Outlet />
        </Paper>
      </Container>
    </Box>
  );
}
