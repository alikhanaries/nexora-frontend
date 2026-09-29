import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { copyToClipboard } from '../../utils/copyToClipboard.js';

/**
 * One-time secret presentation — caller must clear secret when dialog closes.
 * @param {{
 *   open: boolean,
 *   title: string,
 *   secret: string,
 *   helperText?: string,
 *   onClose: () => void,
 * }} props
 */
export function ApiKeySecretDialog({ open, title, secret, helperText, onClose }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!open) {
      setCopied(false);
    }
  }, [open]);

  const handleCopy = async () => {
    const ok = await copyToClipboard(secret);
    setCopied(ok);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth aria-labelledby="api-key-secret-title">
      <DialogTitle id="api-key-secret-title">{title}</DialogTitle>
      <DialogContent className="flex flex-col gap-3">
        <Alert severity="warning" variant="outlined">
          Save this API key now. For security, the full secret will not be shown again.
        </Alert>
        {helperText ? (
          <Typography variant="body2" color="text.secondary">
            {helperText}
          </Typography>
        ) : null}
        <TextField
          label="API key secret"
          value={secret}
          fullWidth
          size="small"
          InputProps={{
            readOnly: true,
            sx: { fontFamily: 'monospace', fontSize: '0.875rem' },
            endAdornment: (
              <InputAdornment position="end">
                <IconButton aria-label="Copy API key secret" onClick={handleCopy} edge="end" size="small">
                  <ContentCopyIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        {copied ? (
          <Typography variant="caption" color="success.main">
            Copied to clipboard.
          </Typography>
        ) : null}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained" size="small">
          I have saved the key
        </Button>
      </DialogActions>
    </Dialog>
  );
}
