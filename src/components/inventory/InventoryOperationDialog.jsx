import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { mapValidationDetailsToFieldErrors } from '../../utils/mapValidationDetails.js';
import { getUserFacingMessage } from '../../services/api/apiError.js';
import { formatQuantity } from '../../utils/formatQuantity.js';

const OPERATION_COPY = {
  adjust: { title: 'Adjust inventory', quantityLabel: 'Delta (non-zero integer)', quantityHelper: 'Positive increases on hand; negative decreases.' },
  receive: { title: 'Receive inventory', quantityLabel: 'Quantity received', quantityHelper: 'Positive integer only.' },
  reserve: { title: 'Reserve inventory', quantityLabel: 'Quantity to reserve', quantityHelper: 'Positive integer.' },
  release: { title: 'Release reservation', quantityLabel: 'Quantity to release (optional)', quantityHelper: 'Leave empty to release per backend defaults, or enter a positive integer.' },
};

/**
 * @param {{
 *   open: boolean,
 *   operation: 'adjust' | 'receive' | 'reserve' | 'release' | null,
 *   balance: import('../../services/api/inventoryService.js').InventoryBalance | null,
 *   locationName?: string,
 *   isSubmitting: boolean,
 *   onClose: () => void,
 *   onSubmit: (payload: Record<string, unknown>) => Promise<void>,
 * }} props
 */
export function InventoryOperationDialog({
  open,
  operation,
  balance,
  locationName,
  isSubmitting,
  onClose,
  onSubmit,
}) {
  const [quantity, setQuantity] = useState('');
  const [referenceType, setReferenceType] = useState('');
  const [referenceId, setReferenceId] = useState('');
  const [fieldErrors, setFieldErrors] = useState(/** @type {Record<string, string>} */ ({}));
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (open) {
      setQuantity('');
      setReferenceType('');
      setReferenceId('');
      setFieldErrors({});
      setFormError('');
    }
  }, [open, operation, balance?.id]);

  const copy = operation ? OPERATION_COPY[operation] : null;
  const requiresReference = operation === 'reserve' || operation === 'release';
  const quantityOptional = operation === 'release';

  const validate = () => {
    const next = {};
    if (!quantityOptional || quantity.trim()) {
      const parsed = Number(quantity);
      if (!quantity.trim() && !quantityOptional) {
        next.quantity = 'Quantity is required.';
      } else if (quantity.trim() && (!Number.isInteger(parsed) || parsed === 0)) {
        next.quantity = operation === 'adjust' ? 'Delta must be a non-zero integer.' : 'Enter a valid integer quantity.';
      } else if (operation === 'receive' || operation === 'reserve') {
        if (!Number.isInteger(parsed) || parsed <= 0) next.quantity = 'Quantity must be a positive integer.';
      } else if (operation === 'release' && quantity.trim() && (!Number.isInteger(parsed) || parsed <= 0)) {
        next.quantity = 'Quantity must be a positive integer when provided.';
      }
    }
    if (requiresReference) {
      if (!referenceType.trim()) next.referenceType = 'Reference type is required.';
      if (!referenceId.trim()) next.referenceId = 'Reference ID is required.';
    }
    setFieldErrors(next);
    return Object.keys(next).length === 0;
  };

  const buildPayload = () => {
    if (!balance || !operation) return null;
    const base = {
      stockLocationId: balance.stockLocationId,
      productId: balance.productId,
      idempotencyKey: crypto.randomUUID(),
    };
    if (operation === 'adjust') {
      return { ...base, delta: Number(quantity) };
    }
    if (operation === 'receive') {
      return { ...base, quantity: Number(quantity) };
    }
    if (operation === 'reserve') {
      return {
        ...base,
        quantity: Number(quantity),
        referenceType: referenceType.trim(),
        referenceId: referenceId.trim(),
      };
    }
    if (operation === 'release') {
      return {
        ...base,
        referenceType: referenceType.trim(),
        referenceId: referenceId.trim(),
        ...(quantity.trim() ? { quantity: Number(quantity) } : {}),
      };
    }
    return null;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    const payload = buildPayload();
    if (!payload) return;
    setFormError('');
    try {
      await onSubmit(payload);
      onClose();
    } catch (error) {
      const mapped = mapValidationDetailsToFieldErrors(error?.validationDetails);
      if (Object.keys(mapped).length > 0) setFieldErrors(mapped);
      setFormError(getUserFacingMessage(error));
    }
  };

  if (!operation || !balance || !copy) {
    return null;
  }

  return (
    <Dialog open={open} onClose={isSubmitting ? undefined : onClose} fullWidth maxWidth="sm" aria-labelledby="inventory-operation-title">
      <DialogTitle id="inventory-operation-title">{copy.title}</DialogTitle>
      <DialogContent className="flex flex-col gap-3 pt-1">
        <Typography variant="body2" color="text.secondary">
          Product: <Typography component="span" variant="body2" fontFamily="monospace">{balance.productId}</Typography>
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Location: {locationName ?? balance.stockLocationId}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Current — On hand: {formatQuantity(balance.onHand)}, Reserved: {formatQuantity(balance.reserved)}, Available:{' '}
          {formatQuantity(balance.available)}
        </Typography>
        {formError ? <Alert severity="error" variant="outlined">{formError}</Alert> : null}
        <TextField
          label={copy.quantityLabel}
          value={quantity}
          onChange={(event) => setQuantity(event.target.value)}
          type="number"
          size="small"
          fullWidth
          required={!quantityOptional}
          error={Boolean(fieldErrors.quantity)}
          helperText={fieldErrors.quantity || copy.quantityHelper}
          inputProps={{ step: 1 }}
        />
        {requiresReference ? (
          <>
            <TextField
              label="Reference type"
              value={referenceType}
              onChange={(event) => setReferenceType(event.target.value)}
              size="small"
              fullWidth
              required
              error={Boolean(fieldErrors.referenceType)}
              helperText={fieldErrors.referenceType || 'Business reference type (required by API).'}
            />
            <TextField
              label="Reference ID"
              value={referenceId}
              onChange={(event) => setReferenceId(event.target.value)}
              size="small"
              fullWidth
              required
              error={Boolean(fieldErrors.referenceId)}
              helperText={fieldErrors.referenceId}
            />
          </>
        ) : null}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? 'Processing…' : 'Submit'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
