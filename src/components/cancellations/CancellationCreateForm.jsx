import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import { getUserFacingMessage } from '../../services/api/apiError.js';
import { mapValidationDetailsToFieldErrors } from '../../utils/mapValidationDetails.js';

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * @param {{
 *   isSubmitting: boolean,
 *   idempotencyKey: string,
 *   onCancel: () => void,
 *   onSubmit: (payload: { body: Record<string, unknown>, idempotencyKey: string }) => Promise<void>,
 * }} props
 */
export function CancellationCreateForm({ isSubmitting, idempotencyKey, onCancel, onSubmit }) {
  const [orderId, setOrderId] = useState('');
  const [reason, setReason] = useState('');
  const [fieldErrors, setFieldErrors] = useState(/** @type {Record<string, string>} */ ({}));
  const [formError, setFormError] = useState('');

  const validate = () => {
    const next = {};
    const trimmedOrder = orderId.trim();
    if (!trimmedOrder) next.orderId = 'Order ID is required.';
    else if (!UUID_PATTERN.test(trimmedOrder)) next.orderId = 'Enter a valid order UUID.';
    if (reason.length > 1024) next.reason = 'Reason must be 1024 characters or fewer.';
    setFieldErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;
    setFormError('');
    const body = {
      orderId: orderId.trim(),
      ...(reason.trim() ? { reason: reason.trim() } : {}),
    };
    try {
      await onSubmit({ body, idempotencyKey });
    } catch (error) {
      const mapped = mapValidationDetailsToFieldErrors(error?.validationDetails);
      if (Object.keys(mapped).length > 0) setFieldErrors(mapped);
      setFormError(getUserFacingMessage(error));
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate className="flex max-w-xl flex-col gap-3">
      {formError ? <Alert severity="error">{formError}</Alert> : null}
      <TextField
        label="Order ID"
        value={orderId}
        onChange={(e) => setOrderId(e.target.value)}
        error={Boolean(fieldErrors.orderId)}
        helperText={fieldErrors.orderId}
        required
        fullWidth
        size="small"
      />
      <TextField
        label="Reason (optional)"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        error={Boolean(fieldErrors.reason)}
        helperText={fieldErrors.reason}
        fullWidth
        size="small"
        multiline
        minRows={2}
      />
      <Box className="flex gap-2">
        <Button type="submit" variant="contained" size="small" disabled={isSubmitting}>
          Request cancellation
        </Button>
        <Button type="button" variant="outlined" size="small" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
      </Box>
    </Box>
  );
}
