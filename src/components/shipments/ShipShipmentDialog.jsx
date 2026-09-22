import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { useState } from 'react';

/**
 * @param {{
 *   open: boolean,
 *   onClose: () => void,
 *   onConfirm: (body: { carrier?: string, service?: string, trackingNumber?: string }) => Promise<void>,
 *   isSubmitting: boolean,
 *   initialCarrier?: string|null,
 *   initialService?: string|null,
 *   initialTracking?: string|null,
 * }} props
 */
export function ShipShipmentDialog({
  open,
  onClose,
  onConfirm,
  isSubmitting,
  initialCarrier,
  initialService,
  initialTracking,
}) {
  const [carrier, setCarrier] = useState(initialCarrier ?? '');
  const [service, setService] = useState(initialService ?? '');
  const [trackingNumber, setTrackingNumber] = useState(initialTracking ?? '');

  const handleSubmit = async () => {
    await onConfirm({
      ...(carrier.trim() ? { carrier: carrier.trim() } : {}),
      ...(service.trim() ? { service: service.trim() } : {}),
      ...(trackingNumber.trim() ? { trackingNumber: trackingNumber.trim() } : {}),
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Mark shipment as shipped</DialogTitle>
      <DialogContent className="flex flex-col gap-3 pt-2">
        <TextField label="Carrier" size="small" value={carrier} onChange={(e) => setCarrier(e.target.value)} />
        <TextField label="Service" size="small" value={service} onChange={(e) => setService(e.target.value)} />
        <TextField
          label="Tracking number"
          size="small"
          value={trackingNumber}
          onChange={(e) => setTrackingNumber(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? 'Shipping…' : 'Confirm ship'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
