import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useEffect, useMemo, useState } from 'react';
import { MAX_CANCELLATION_REASON_LENGTH } from '../../constants/cancellationCatalog.js';
import { getUserFacingMessage } from '../../services/api/apiError.js';
import { getCancellableQuantity } from '../../utils/orderCancellability.js';

/**
 * @param {{
 *   open: boolean,
 *   order: import('../../services/api/ordersService.js').OrderDetail,
 *   isSubmitting: boolean,
 *   onClose: () => void,
 *   onSubmit: (body: { reason?: string|null, lines?: Array<{ orderLineId: string, quantity: number }> }) => Promise<void>,
 * }} props
 */
export function CancelOrderDialog({ open, order, isSubmitting, onClose, onSubmit }) {
  const [reason, setReason] = useState('');
  const [mode, setMode] = useState('full');
  const [lineQuantities, setLineQuantities] = useState(/** @type {Record<string, string>} */ ({}));
  const [formError, setFormError] = useState('');

  const cancellableLines = useMemo(
    () => order.lines.filter((line) => getCancellableQuantity(line) > 0),
    [order.lines],
  );

  useEffect(() => {
    if (open) {
      setReason('');
      setMode('full');
      setFormError('');
      const initial = {};
      for (const line of cancellableLines) {
        initial[line.id] = String(getCancellableQuantity(line));
      }
      setLineQuantities(initial);
    }
  }, [open, order.id, cancellableLines]);

  const buildPayload = () => {
    const trimmedReason = reason.trim();
    const payload = {
      ...(trimmedReason ? { reason: trimmedReason } : {}),
    };
    if (mode === 'partial') {
      const lines = [];
      for (const line of cancellableLines) {
        const raw = lineQuantities[line.id] ?? '';
        if (!raw.trim()) continue;
        const quantity = Number.parseInt(raw, 10);
        if (!Number.isInteger(quantity) || quantity <= 0) {
          throw new Error(`Enter a positive quantity for SKU ${line.merchantSku}`);
        }
        const max = getCancellableQuantity(line);
        if (quantity > max) {
          throw new Error(`Quantity for ${line.merchantSku} cannot exceed ${max}`);
        }
        lines.push({ orderLineId: line.id, quantity });
      }
      if (lines.length === 0) {
        throw new Error('Select at least one line with a cancellation quantity');
      }
      payload.lines = lines;
    }
    return payload;
  };

  const handleSubmit = async () => {
    setFormError('');
    if (reason.length > MAX_CANCELLATION_REASON_LENGTH) {
      setFormError(`Reason must be at most ${MAX_CANCELLATION_REASON_LENGTH} characters`);
      return;
    }
    try {
      const body = buildPayload();
      await onSubmit(body);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : getUserFacingMessage(error));
    }
  };

  return (
    <Dialog open={open} onClose={isSubmitting ? undefined : onClose} fullWidth maxWidth="md" aria-labelledby="cancel-order-dialog-title">
      <DialogTitle id="cancel-order-dialog-title">Cancel order {order.orderNumber}</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" className="mb-3">
          Cancels remaining quantity on this order and releases inventory per backend rules. Shipped quantity cannot be
          cancelled from this dialog.
        </Typography>
        <TextField
          label="Reason (optional)"
          size="small"
          fullWidth
          multiline
          minRows={2}
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          inputProps={{ maxLength: MAX_CANCELLATION_REASON_LENGTH }}
          className="mb-3"
        />
        <Typography variant="subtitle2" className="mb-1">
          Scope
        </Typography>
        <RadioGroup row value={mode} onChange={(event) => setMode(event.target.value)} className="mb-2">
          <FormControlLabel value="full" control={<Radio size="small" />} label="Cancel all remaining quantity" />
          <FormControlLabel
            value="partial"
            control={<Radio size="small" />}
            label="Partial line cancellation"
            disabled={cancellableLines.length === 0}
          />
        </RadioGroup>
        {mode === 'partial' ? (
          <Box className="overflow-x-auto">
            <Table size="small" aria-label="Cancellation line quantities">
              <TableHead>
                <TableRow>
                  <TableCell>SKU</TableCell>
                  <TableCell align="right">Ordered</TableCell>
                  <TableCell align="right">Shipped</TableCell>
                  <TableCell align="right">Cancelled</TableCell>
                  <TableCell align="right">Remaining</TableCell>
                  <TableCell align="right">Cancel qty</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cancellableLines.map((line) => {
                  const remaining = getCancellableQuantity(line);
                  return (
                    <TableRow key={line.id}>
                      <TableCell>{line.merchantSku}</TableCell>
                      <TableCell align="right">{line.quantity}</TableCell>
                      <TableCell align="right">{line.shippedQuantity}</TableCell>
                      <TableCell align="right">{line.cancelledQuantity}</TableCell>
                      <TableCell align="right">{remaining}</TableCell>
                      <TableCell align="right">
                        <TextField
                          size="small"
                          type="number"
                          value={lineQuantities[line.id] ?? ''}
                          onChange={(event) =>
                            setLineQuantities((prev) => ({ ...prev, [line.id]: event.target.value }))
                          }
                          inputProps={{ min: 1, max: remaining, 'aria-label': `Cancel quantity for ${line.merchantSku}` }}
                          sx={{ width: 88 }}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Box>
        ) : null}
        {formError ? (
          <Alert severity="error" className="mt-3">
            {formError}
          </Alert>
        ) : null}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isSubmitting}>
          Close
        </Button>
        <Button variant="contained" color="warning" onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? 'Cancelling…' : 'Continue'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
