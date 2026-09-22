import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { PRICE_STATUS_OPTIONS } from '../../constants/priceCatalog.js';

/**
 * Supported list filters: productId, channelId, currency, status — no SKU/text search.
 * @param {{
 *   productId: string,
 *   channelId: string,
 *   currency: string,
 *   status: string,
 *   onChange: (field: string, value: string) => void,
 * }} props
 */
export function PriceFilters({ productId, channelId, currency, status, onChange }) {
  return (
    <Box className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <TextField
        label="Product ID"
        size="small"
        value={productId}
        onChange={(event) => onChange('productId', event.target.value)}
        placeholder="UUID"
      />
      <TextField
        label="Channel ID"
        size="small"
        value={channelId}
        onChange={(event) => onChange('channelId', event.target.value)}
        placeholder="UUID (optional filter)"
      />
      <TextField
        label="Currency"
        size="small"
        value={currency}
        onChange={(event) => onChange('currency', event.target.value.toUpperCase())}
        inputProps={{ maxLength: 3 }}
        placeholder="e.g. USD"
      />
      <FormControl size="small">
        <InputLabel id="price-status-filter">Status</InputLabel>
        <Select
          labelId="price-status-filter"
          label="Status"
          value={status}
          onChange={(event) => onChange('status', event.target.value)}
        >
          <MenuItem value="">All</MenuItem>
          {PRICE_STATUS_OPTIONS.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Typography variant="caption" color="text.secondary" className="sm:col-span-2 lg:col-span-4">
        Filters match backend query parameters only. SKU search is not available on the pricing list API.
      </Typography>
    </Box>
  );
}
