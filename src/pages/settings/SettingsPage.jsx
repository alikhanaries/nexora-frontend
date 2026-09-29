import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { PageHeader } from '../../components/common/PageHeader.jsx';
import { AccountSummaryPanel } from '../../components/settings/AccountSummaryPanel.jsx';
import { MfaEnrollmentPanel } from '../../components/settings/MfaEnrollmentPanel.jsx';
import { MfaStepUpPanel } from '../../components/settings/MfaStepUpPanel.jsx';
import { TenantOrganizationPanel } from '../../components/settings/TenantOrganizationPanel.jsx';
import { DeveloperToolsPanel } from '../../components/settings/DeveloperToolsPanel.jsx';
import { useAuth } from '../../hooks/useAuth.js';

export function SettingsPage() {
  const { logout } = useAuth();

  return (
    <>
      <PageHeader
        title="Settings"
        description="Account and security preferences for your signed-in user."
      />
      <Box className="flex flex-col gap-4">
        <AccountSummaryPanel />
        <TenantOrganizationPanel />
        <DeveloperToolsPanel />

        <Paper variant="outlined" className="p-4">
          <Typography variant="subtitle2" gutterBottom>
            Password
          </Typography>
          <Typography variant="body2" color="text.secondary">
            The backend does not expose an authenticated change-password endpoint. Password reset use cases exist in
            the identity module but are not published as HTTP routes in the current API inventory. Use your
            organization&apos;s account recovery process when available.
          </Typography>
        </Paper>

        <MfaEnrollmentPanel />
        <MfaStepUpPanel />

        <Paper variant="outlined" className="p-4">
          <Typography variant="subtitle2" gutterBottom>
            Sessions
          </Typography>
          <Typography variant="body2" color="text.secondary" className="mb-2">
            Listing or revoking individual sessions is not available via the public API. You can sign out of this
            browser session below, which revokes the current refresh token through POST /api/v1/auth/logout.
          </Typography>
          <Button variant="outlined" color="inherit" size="small" onClick={() => logout()}>
            Sign out
          </Button>
        </Paper>

        <Paper variant="outlined" className="p-4">
          <Typography variant="subtitle2" gutterBottom>
            Profile
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Updating profile fields (name, email, etc.) is not supported by GET /auth/me or related account PATCH
            endpoints in the current backend contract.
          </Typography>
        </Paper>
      </Box>
    </>
  );
}
