import Typography from '@mui/material/Typography';

/**
 * Placeholder protected route to verify routing — not a product dashboard.
 */
export function FoundationPage() {
  return (
    <>
      <Typography variant="h2" component="h1" gutterBottom>
        Application foundation
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Phase 2 scaffold is active. Module pages (products, orders, channels, and others) will be
        added in subsequent phases.
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Configure <code>VITE_API_BASE_URL</code> in your local <code>.env</code> file to connect to
        the Nexora backend <code>/api/v1</code> surface.
      </Typography>
    </>
  );
}
