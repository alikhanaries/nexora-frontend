import Typography from '@mui/material/Typography';

/**
 * Sign-in UI is implemented in a later phase.
 * Route exists to verify public routing and layout.
 */
export function LoginPage() {
  return (
    <>
      <Typography variant="h2" component="h1" gutterBottom>
        Sign in
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Authentication forms and session handling will be added in the next phase. The API client
        and auth services are already wired to the existing backend contracts.
      </Typography>
    </>
  );
}
