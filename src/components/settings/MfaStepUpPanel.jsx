import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Paper from '@mui/material/Paper';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { useRecoveryCodeStepUp, useVerifyMfaStepUp } from '../../hooks/mfa/useMfaMutations.js';
import { useNotification } from '../../hooks/useNotification.js';
import { getUserFacingMessage } from '../../services/api/apiError.js';

export function MfaStepUpPanel() {
  const verifyMutation = useVerifyMfaStepUp();
  const recoveryMutation = useRecoveryCodeStepUp();
  const { notify } = useNotification();
  const [mode, setMode] = useState('totp');
  const [code, setCode] = useState('');
  const [formError, setFormError] = useState('');

  const handleSubmit = async () => {
    setFormError('');
    const trimmed = code.trim();
    if (trimmed.length < 6) {
      setFormError('Enter a valid code.');
      return;
    }
    try {
      if (mode === 'totp') {
        await verifyMutation.mutateAsync({ code: trimmed });
      } else {
        await recoveryMutation.mutateAsync({ code: trimmed });
      }
      setCode('');
      notify('Step-up verification succeeded for this session.', 'success');
    } catch (error) {
      setFormError(getUserFacingMessage(error));
    }
  };

  const isBusy = verifyMutation.isPending || recoveryMutation.isPending;

  return (
    <Paper variant="outlined" className="p-4">
      <Typography variant="subtitle2" gutterBottom>
        Step-up verification
      </Typography>
      <Typography variant="body2" color="text.secondary" className="mb-3">
        If a sensitive operation requires MFA step-up, verify your authenticator code or a one-time recovery code for
        the current session.
      </Typography>
      <RadioGroup row value={mode} onChange={(event) => setMode(event.target.value)} className="mb-2">
        <FormControlLabel value="totp" control={<Radio size="small" />} label="Authenticator code" />
        <FormControlLabel value="recovery" control={<Radio size="small" />} label="Recovery code" />
      </RadioGroup>
      <Box className="flex flex-wrap items-end gap-2">
        <TextField
          label={mode === 'totp' ? 'Authenticator code' : 'Recovery code'}
          size="small"
          value={code}
          onChange={(event) => setCode(event.target.value)}
          inputProps={{
            autoComplete: 'one-time-code',
            maxLength: 16,
            'aria-label': mode === 'totp' ? 'Authenticator code' : 'Recovery code',
          }}
          sx={{ minWidth: 200 }}
        />
        <Button variant="contained" onClick={handleSubmit} disabled={isBusy}>
          {isBusy ? 'Verifying…' : 'Verify'}
        </Button>
      </Box>
      {formError ? (
        <Alert severity="error" className="mt-3">
          {formError}
        </Alert>
      ) : null}
    </Paper>
  );
}
