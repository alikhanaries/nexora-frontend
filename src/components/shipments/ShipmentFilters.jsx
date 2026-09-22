import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { SHIPMENT_STATUS_OPTIONS } from '../../constants/shipmentCatalog.js';

/**
 * @param {{
 *   status: string,
 *   orderId: string,
 *   trackingNumber: string,
 *   onChange: (field: string, value: string) => void,
 * }} props
 */
export function ShipmentFilters({ status, orderId, trackingNumber, onChange }) {
  return (
    <Box className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <FormControl size="small">
        <InputLabel id="shipment-status-filter">Status</InputLabel>
        <Select
          labelId="shipment-status-filter"
          label="Status"
          value={status}
          onChange={(event) => onChange('status', event.target.value)}
        >
          <MenuItem value="">All</MenuItem>
          {SHIPMENT_STATUS_OPTIONS.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        label="Order ID"
        size="small"
        value={orderId}
        onChange={(event) => onChange('orderId', event.target.value)}
        placeholder="UUID"
      />
      <TextField
        label="Tracking number"
        size="small"
        value={trackingNumber}
        onChange={(event) => onChange('trackingNumber', event.target.value)}
      />
      <Typography variant="caption" color="text.secondary" className="sm:col-span-2 lg:col-span-3">
        List API: GET /shipments with cursor pagination. No carrier filter on the backend.
      </Typography>
    </Box>
  );
}
