import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { useShipments } from '../../hooks/shipments/useShipmentQueries.js';
import { getUserFacingMessage } from '../../services/api/apiError.js';
import { mapValidationDetailsToFieldErrors } from '../../utils/mapValidationDetails.js';

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * @param {{
 *   orderId: string,
 *   orderLines: Array<{ id: string, merchantSku: string, quantity: number, returnedQuantity: number, cancelledQuantity: number }>,
 *   isSubmitting: boolean,
 *   idempotencyKey: string,
 *   onSubmit: (payload: { body: Record<string, unknown>, idempotencyKey: string }) => Promise<void>,
 *   onCancel: () => void,
 * }} props
 */
export function ReturnForm({ orderId, orderLines, isSubmitting, idempotencyKey, onSubmit, onCancel }) {
  const { data: shipmentsData } = useShipments({ orderId, limit: 50 });
  const [returnReason, setReturnReason] = useState('');
  const [shipmentId, setShipmentId] = useState('');
  const [selected, setSelected] = useState(() =>
    Object.fromEntries(
      orderLines.map((line) => [line.id, { included: true, quantity: '1', reason: '' }]),
    ),
  );
  const [fieldErrors, setFieldErrors] = useState(/** @type {Record<string, string>} */ ({}));
  const [formError, setFormError] = useState('');

  const validate = () => {
    const next = {};
    const lines = [];
    for (const [orderLineId, entry] of Object.entries(selected)) {
      if (!entry.included) continue;
      const orderLine = orderLines.find((line) => line.id === orderLineId);
      const qty = Number(entry.quantity);
      if (!orderLine) continue;
      const maxQty = orderLine.quantity - orderLine.cancelledQuantity - orderLine.returnedQuantity;
      if (!Number.isInteger(qty) || qty <= 0) {
        next[`line.${orderLineId}`] = 'Quantity must be a positive integer.';
        continue;
      }
      if (qty > maxQty) {
        next[`line.${orderLineId}`] = `Quantity cannot exceed returnable quantity (${maxQty}).`;
        continue;
      }
      if (entry.reason.length > 512) {
        next[`line.${orderLineId}.reason`] = 'Reason must be at most 512 characters.';
        continue;
      }
      lines.push({
        orderLineId,
        quantity: qty,
        ...(entry.reason.trim() ? { reason: entry.reason.trim() } : {}),
      });
    }
    if (lines.length === 0) next.lines = 'Select at least one line with a valid quantity.';
    if (returnReason.length > 512) next.returnReason = 'Reason must be at most 512 characters.';
    if (shipmentId.trim() && !UUID_PATTERN.test(shipmentId.trim())) {
      next.shipmentId = 'Shipment ID must be a valid UUID or empty.';
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
      ...(returnReason.trim() ? { reason: returnReason.trim() } : { reason: null }),
      ...(shipmentId.trim() ? { shipmentId: shipmentId.trim() } : {}),
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

      <TextField
        label="Return reason (optional)"
        size="small"
        multiline
        minRows={2}
        value={returnReason}
        onChange={(event) => setReturnReason(event.target.value)}
        error={Boolean(fieldErrors.returnReason)}
        helperText={fieldErrors.returnReason || 'Header-level reason for the return request.'}
      />

      <FormControl size="small" fullWidth>
        <InputLabel id="return-shipment-select">Related shipment (optional)</InputLabel>
        <Select
          labelId="return-shipment-select"
          label="Related shipment (optional)"
          value={shipmentId}
          onChange={(event) => setShipmentId(event.target.value)}
        >
          <MenuItem value="">None</MenuItem>
          {(shipmentsData?.items ?? []).map((shipment) => (
            <MenuItem key={shipment.id} value={shipment.id}>
              {shipment.id.slice(0, 8)}… — {shipment.status}
            </MenuItem>
          ))}
        </Select>
        {fieldErrors.shipmentId ? (
          <Typography variant="caption" color="error">
            {fieldErrors.shipmentId}
          </Typography>
        ) : null}
      </FormControl>

      <Typography variant="subtitle2">Return lines</Typography>
      {fieldErrors.lines ? (
        <Typography variant="caption" color="error">
          {fieldErrors.lines}
        </Typography>
      ) : null}

      {orderLines.map((line) => {
        const entry = selected[line.id] ?? { included: false, quantity: '1', reason: '' };
        const maxQty = line.quantity - line.cancelledQuantity - line.returnedQuantity;
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
              label={`SKU ${line.merchantSku} — line ${line.id.slice(0, 8)}…`}
            />
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
              Ordered {line.quantity}, returned {line.returnedQuantity}, cancelled {line.cancelledQuantity}. Returnable:{' '}
              {maxQty}
            </Typography>
            {entry.included ? (
              <Box className="grid gap-2 sm:grid-cols-2">
                <TextField
                  label="Return quantity"
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
                <TextField
                  label="Line reason (optional)"
                  size="small"
                  value={entry.reason}
                  onChange={(event) =>
                    setSelected((prev) => ({
                      ...prev,
                      [line.id]: { ...entry, reason: event.target.value },
                    }))
                  }
                  error={Boolean(fieldErrors[`line.${line.id}.reason`])}
                />
              </Box>
            ) : null}
          </Box>
        );
      })}

      <Box className="flex flex-wrap gap-2 pt-2">
        <Button type="submit" variant="contained" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting…' : 'Create return'}
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
