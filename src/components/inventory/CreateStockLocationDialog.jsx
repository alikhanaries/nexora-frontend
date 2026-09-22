import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import { getUserFacingMessage } from '../../services/api/apiError.js';
import { mapValidationDetailsToFieldErrors } from '../../utils/mapValidationDetails.js';

/**
 * @param {{ open: boolean, isSubmitting: boolean, onClose: () => void, onSubmit: (body: { name: string, externalReference?: string }) => Promise<void> }} props
 */
export function CreateStockLocationDialog({ open, isSubmitting, onClose, onSubmit }) {
  const [name, setName] = useState('');
  const [externalReference, setExternalReference] = useState('');
  const [fieldErrors, setFieldErrors] = useState(/** @type {Record<string, string>} */ ({}));
  const [formError, setFormError] = useState('');

  const handleSubmit = async () => {
    const next = {};
    if (!name.trim()) next.name = 'Name is required.';
    setFieldErrors(next);
    if (Object.keys(next).length > 0) return;

    setFormError('');
    try {
      await onSubmit({
        name: name.trim(),
        ...(externalReference.trim() ? { externalReference: externalReference.trim() } : {}),
      });
      setName('');
      setExternalReference('');
      onClose();
    } catch (error) {
      setFieldErrors(mapValidationDetailsToFieldErrors(error?.validationDetails));
      setFormError(getUserFacingMessage(error));
    }
  };

  return (
    <Dialog open={open} onClose={isSubmitting ? undefined : onClose} fullWidth maxWidth="sm">
      <DialogTitle>New stock location</DialogTitle>
      <DialogContent className="flex flex-col gap-3 pt-1">
        {formError ? <Alert severity="error" variant="outlined">{formError}</Alert> : null}
        <TextField
          label="Name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
          size="small"
          fullWidth
          error={Boolean(fieldErrors.name)}
          helperText={fieldErrors.name}
        />
        <TextField
          label="External reference"
          value={externalReference}
          onChange={(event) => setExternalReference(event.target.value)}
          size="small"
          fullWidth
          helperText="Optional warehouse or WMS reference."
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? 'Creating…' : 'Create location'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
