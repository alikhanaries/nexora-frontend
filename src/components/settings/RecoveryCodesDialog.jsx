import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import { copyToClipboard } from '../../utils/copyToClipboard.js';

/**
 * @param {{
 *   open: boolean,
 *   recoveryCodes: string[],
 *   onClose: () => void,
 * }} props
 */
export function RecoveryCodesDialog({ open, recoveryCodes, onClose }) {
  const handleCopyAll = async () => {
    await copyToClipboard(recoveryCodes.join('\n'));
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" aria-labelledby="recovery-codes-title">
      <DialogTitle id="recovery-codes-title">Save your recovery codes</DialogTitle>
      <DialogContent>
        <Alert severity="warning" className="mb-3">
          These codes are shown once. Store them securely. Each code can be used a single time for step-up
          authentication.
        </Alert>
        <List dense>
          {recoveryCodes.map((code) => (
            <ListItem key={code} sx={{ fontFamily: 'monospace' }}>
              <ListItemText primary={code} />
            </ListItem>
          ))}
        </List>
        <Typography variant="caption" color="text.secondary">
          Do not share these codes or store them in browser-synced notes unless your policy allows it.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCopyAll}>Copy all</Button>
        <Button variant="contained" onClick={onClose}>
          I have saved these codes
        </Button>
      </DialogActions>
    </Dialog>
  );
}
