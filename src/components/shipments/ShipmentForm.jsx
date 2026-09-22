import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useMemo, useState } from 'react';
import { getUserFacingMessage } from '../../services/api/apiError.js';
import { mapValidationDetailsToFieldErrors } from '../../utils/mapValidationDetails.js';

/**
 * @param {{
 *   orderLines: Array<{ id: string, merchantSku: string, quantity: number, shippedQuantity: number, cancelledQuantity: number }>,
 *   isSubmitting: boolean,
 *   idempotencyKey: string,
 *   onSubmit: (payload: { body: Record<string, unknown>, idempotencyKey: string }) => Promise<void>,
 *   onCancel: () => void,
 * }} props
 */
export function ShipmentForm({ orderLines, isSubmitting, idempotencyKey, onSubmit, onCancel }) {
  const [carrier, setCarrier] = useState('');
  const [service, setService] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [selected, setSelected] = useState(() =>
    Object.fromEntries(orderLines.map((line) => [line.id, { included: true, quantity: String(line.quantity) }])),
  );
  const [fieldErrors, setFieldErrors] = useState(/** @type {Record<string, string>} */ ({}));
  const [formError, setFormError] = useState('');

  const lineById = useMemo(() => Object.fromEntries(orderLines.map((line) => [line.id, line])), [orderLines]);

  const validate = () => {
    const next = {};
    const lines = [];
    for (const [orderLineId, entry] of Object.entries(selected)) {
      if (!entry.included) continue;
      const orderLine = lineById[orderLineId];
      const qty = Number(entry.quantity);
      if (!orderLine) continue;
      const maxQty = orderLine.quantity - orderLine.cancelledQuantity - orderLine.shippedQuantity;
      if (!Number.isInteger(qty) || qty <= 0) {
        next[`line.${orderLineId}`] = 'Quantity must be a positive integer.';
        continue;
      }
      if (qty > maxQty) {
        next[`line.${orderLineId}`] = `Quantity cannot exceed remaining shippable quantity (${maxQty}).`;
        continue;
      }
      lines.push({ orderLineId, quantity: qty });
    }
    if (lines.length === 0) {
      next.lines = 'Select at least one order line with a valid quantity.';
    }
    setFieldErrors(next);
    return Object.keys(next).length === 0 ? lines : null;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const lines = validate();
    if (!lines) return;
    setFormError('');

    const body = {
      lines,
      ...(carrier.trim() ? { carrier: carrier.trim() } : {}),
      ...(service.trim() ? { service: service.trim() } : {}),
      ...(trackingNumber.trim() ? { trackingNumber: trackingNumber.trim() } : {}),
    };

    try {
      await onSubmit({ body, idempotencyKey });
    } catch (error) {
      setFieldErrors(mapValidationDetailsToFieldErrors(error?.validationDetails));
      setFormError(getUserFacingMessage(error));
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate className="flex max-w-3xl flex-col gap-4">
      {formError ? (
        <Alert severity="error" variant="outlined">
          {formError}
        </Alert>
      ) : null}

      <Typography variant="subtitle2">Carrier (optional)</Typography>
      <Box className="grid gap-3 sm:grid-cols-3">
        <TextField label="Carrier" size="small" value={carrier} onChange={(e) => setCarrier(e.target.value)} />
        <TextField label="Service" size="small" value={service} onChange={(e) => setService(e.target.value)} />
        <TextField
          label="Tracking number"
          size="small"
          value={trackingNumber}
          onChange={(e) => setTrackingNumber(e.target.value)}
        />
      </Box>

      <Typography variant="subtitle2">Shipment lines</Typography>
      {fieldErrors.lines ? (
        <Typography variant="caption" color="error">
          {fieldErrors.lines}
        </Typography>
      ) : null}
      {orderLines.map((line) => {
        const entry = selected[line.id] ?? { included: false, quantity: '1' };
        const maxQty = line.quantity - line.cancelledQuantity - line.shippedQuantity;
        return (
          <Box key={line.id} className="rounded border border-neutral-200 p-3">
            <FormControlLabel
              control={
                <Checkbox
                  checked={entry.included}
                  onChange={(event) =>
                    setSelected((prev) => ({
                      ...prev,
                      [line.id]: { ...entry, included: event.target.checked },
                    }))
                  }
                />
              }
              label={`SKU ${line.merchantSku} — order line ${line.id.slice(0, 8)}…`}
            />
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
              Ordered {line.quantity}, shipped {line.shippedQuantity}, cancelled {line.cancelledQuantity}. Remaining:{' '}
              {maxQty}
            </Typography>
            {entry.included ? (
              <TextField
                label="Ship quantity"
                size="small"
                type="number"
                inputProps={{ min: 1, max: maxQty, step: 1 }}
                value={entry.quantity}
                onChange={(event) =>
                  setSelected((prev) => ({
                    ...prev,
                    [line.id]: { ...entry, quantity: event.target.value },
                  }))
                }
                error={Boolean(fieldErrors[`line.${line.id}`])}
                helperText={fieldErrors[`line.${line.id}`]}
              />
            ) : null}
          </Box>
        );
      })}

      <Box className="flex flex-wrap gap-2 pt-2">
        <Button type="submit" variant="contained" disabled={isSubmitting}>
          {isSubmitting ? 'Creating…' : 'Create shipment'}
        </Button>
        <Button type="button" variant="outlined" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
      </Box>
      <Typography variant="caption" color="text.secondary">
        Idempotency key: {idempotencyKey.slice(0, 8)}… (fixed for this page visit)
      </Typography>
    </Box>
  );
}
