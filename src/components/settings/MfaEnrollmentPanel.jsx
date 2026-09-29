import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { PERMISSIONS } from '../../constants/permissions.js';
import {
  useActivateTotpFactor,
  useStartTotpEnrollment,
  useVerifyTotpEnrollment,
} from '../../hooks/mfa/useMfaMutations.js';
import { usePermissions } from '../../hooks/permissions/usePermissions.js';
import { useNotification } from '../../hooks/useNotification.js';
import { getUserFacingMessage } from '../../services/api/apiError.js';
import { copyToClipboard } from '../../utils/copyToClipboard.js';
import { canShowPermissionAction } from '../../utils/permissionAction.js';
import { RecoveryCodesDialog } from './RecoveryCodesDialog.jsx';

export function MfaEnrollmentPanel() {
  const permission = usePermissions();
  const canManage = canShowPermissionAction(permission, PERMISSIONS.MFA_MANAGE);
  const startMutation = useStartTotpEnrollment();
  const verifyMutation = useVerifyTotpEnrollment();
  const activateMutation = useActivateTotpFactor();
  const { notify } = useNotification();

  const [label, setLabel] = useState('');
  const [factorId, setFactorId] = useState('');
  const [otpauthUri, setOtpauthUri] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [recoveryCodes, setRecoveryCodes] = useState(/** @type {string[]} */ ([]));
  const [recoveryDialogOpen, setRecoveryDialogOpen] = useState(false);
  const [formError, setFormError] = useState('');

  const resetEnrollment = () => {
    setFactorId('');
    setOtpauthUri('');
    setVerificationCode('');
    setFormError('');
  };

  const handleStart = async () => {
    setFormError('');
    try {
      const result = await startMutation.mutateAsync(label.trim() ? { label: label.trim() } : {});
      setFactorId(result.factorId);
      setOtpauthUri(result.otpauthUri);
      notify('Scan or copy the authenticator setup URI, then enter a verification code.', 'info');
    } catch (error) {
      setFormError(getUserFacingMessage(error));
    }
  };

  const handleVerify = async () => {
    setFormError('');
    if (!factorId || !verificationCode.trim()) {
      setFormError('Enter the 6-digit code from your authenticator app.');
      return;
    }
    try {
      await verifyMutation.mutateAsync({
        factorId,
        code: verificationCode.trim(),
      });
      notify('Verification code accepted. Activate MFA to finish.', 'success');
    } catch (error) {
      setFormError(getUserFacingMessage(error));
    }
  };

  const handleActivate = async () => {
    setFormError('');
    if (!factorId) return;
    try {
      const result = await activateMutation.mutateAsync({ factorId });
      setRecoveryCodes(result.recoveryCodes ?? []);
      setRecoveryDialogOpen(true);
      resetEnrollment();
      notify('Two-factor authentication is now active.', 'success');
    } catch (error) {
      setFormError(getUserFacingMessage(error));
    }
  };

  const handleCopyUri = async () => {
    const copied = await copyToClipboard(otpauthUri);
    notify(copied ? 'Setup URI copied.' : 'Unable to copy.', copied ? 'success' : 'error');
  };

  if (!canManage) {
    return (
      <Paper variant="outlined" className="p-4">
        <Typography variant="subtitle2" gutterBottom>
          Two-factor authentication (TOTP)
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Your account does not have permission to manage MFA (mfa.manage). Contact a tenant administrator if you
          need to enroll an authenticator app.
        </Typography>
      </Paper>
    );
  }

  const isBusy = startMutation.isPending || verifyMutation.isPending || activateMutation.isPending;

  return (
    <>
      <Paper variant="outlined" className="p-4">
        <Typography variant="subtitle2" gutterBottom>
          Two-factor authentication (TOTP)
        </Typography>
        <Typography variant="body2" color="text.secondary" className="mb-3">
          Enroll an authenticator app using the backend TOTP flow: start → verify code → activate. Recovery codes are
          issued once on activation. There is no API to disable MFA or check enrollment status from the frontend.
        </Typography>

        {!factorId ? (
          <Box className="flex flex-col gap-3 sm:max-w-md">
            <TextField
              label="Authenticator label (optional)"
              size="small"
              value={label}
              onChange={(event) => setLabel(event.target.value)}
              inputProps={{ maxLength: 64 }}
            />
            <Button variant="contained" onClick={handleStart} disabled={isBusy}>
              {startMutation.isPending ? 'Starting…' : 'Start enrollment'}
            </Button>
          </Box>
        ) : (
          <Box className="flex flex-col gap-3">
            <Alert severity="info">
              Add this account to your authenticator app using the setup URI below. The URI contains a one-time setup
              secret — do not share it.
            </Alert>
            <TextField
              label="Setup URI (otpauth)"
              size="small"
              value={otpauthUri}
              multiline
              minRows={2}
              InputProps={{ readOnly: true, sx: { fontFamily: 'monospace', fontSize: 12 } }}
            />
            <Box className="flex flex-wrap gap-2">
              <Button variant="outlined" size="small" onClick={handleCopyUri}>
                Copy setup URI
              </Button>
              <Button variant="text" size="small" onClick={resetEnrollment} disabled={isBusy}>
                Cancel enrollment
              </Button>
            </Box>
            <TextField
              label="Verification code"
              size="small"
              value={verificationCode}
              onChange={(event) => setVerificationCode(event.target.value)}
              inputProps={{ inputMode: 'numeric', autoComplete: 'one-time-code', maxLength: 16 }}
              sx={{ maxWidth: 240 }}
            />
            <Box className="flex flex-wrap gap-2">
              <Button variant="outlined" onClick={handleVerify} disabled={isBusy}>
                {verifyMutation.isPending ? 'Verifying…' : 'Verify code'}
              </Button>
              <Button variant="contained" onClick={handleActivate} disabled={isBusy}>
                {activateMutation.isPending ? 'Activating…' : 'Activate MFA'}
              </Button>
            </Box>
          </Box>
        )}

        {formError ? (
          <Alert severity="error" className="mt-3">
            {formError}
          </Alert>
        ) : null}
      </Paper>

      <RecoveryCodesDialog
        open={recoveryDialogOpen}
        recoveryCodes={recoveryCodes}
        onClose={() => {
          setRecoveryDialogOpen(false);
          setRecoveryCodes([]);
        }}
      />
    </>
  );
}
