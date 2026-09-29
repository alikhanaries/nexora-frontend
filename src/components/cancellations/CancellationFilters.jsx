import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import { CANCELLATION_STATUS_OPTIONS } from '../../constants/cancellationCatalog.js';
import { getCancellationStatusPresentation } from '../../constants/cancellationStatusPresentation.js';

/**
 * @param {{
 *   status: string,
 *   orderId: string,
 *   onChange: (field: string, value: string) => void,
 * }} props
 */
export function CancellationFilters({ status, orderId, onChange }) {
  return (
    <Box className="mb-4 grid gap-3 sm:grid-cols-2">
      <FormControl size="small">
        <InputLabel id="cancellation-status-filter">Status</InputLabel>
        <Select
          labelId="cancellation-status-filter"
          label="Status"
          value={status}
          onChange={(event) => onChange('status', event.target.value)}
        >
          <MenuItem value="">All</MenuItem>
          {CANCELLATION_STATUS_OPTIONS.map((option) => (
            <MenuItem key={option} value={option}>
              {getCancellationStatusPresentation(option).label}
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
        inputProps={{ 'aria-label': 'Filter by order ID' }}
      />
    </Box>
  );
}
