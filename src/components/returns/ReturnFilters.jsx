import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { RETURN_STATUS_OPTIONS } from '../../constants/returnCatalog.js';

/**
 * Backend filters: status, orderId — no shipmentId/reason list filters.
 * @param {{
 *   status: string,
 *   orderId: string,
 *   onChange: (field: string, value: string) => void,
 * }} props
 */
export function ReturnFilters({ status, orderId, onChange }) {
  return (
    <Box className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <FormControl size="small">
        <InputLabel id="return-status-filter">Status</InputLabel>
        <Select
          labelId="return-status-filter"
          label="Status"
          value={status}
          onChange={(event) => onChange('status', event.target.value)}
        >
          <MenuItem value="">All</MenuItem>
          {RETURN_STATUS_OPTIONS.map((option) => (
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
      <Typography variant="caption" color="text.secondary" className="sm:col-span-2 lg:col-span-3">
        List API supports status and orderId only. Create returns from an order detail page.
      </Typography>
    </Box>
  );
}
