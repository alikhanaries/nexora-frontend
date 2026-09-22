import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { PRODUCT_STATUS_OPTIONS } from '../../constants/productCatalog.js';

/**
 * Backend supports status filter only — no SKU/text search (GAP-6).
 * @param {{ status: string, onStatusChange: (value: string) => void }} props
 */
export function ProductFilters({ status, onStatusChange }) {
  return (
    <Box className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
      <FormControl size="small" sx={{ minWidth: 200 }}>
        <InputLabel id="product-status-filter-label">Status</InputLabel>
        <Select
          labelId="product-status-filter-label"
          id="product-status-filter"
          label="Status"
          value={status}
          onChange={(event) => onStatusChange(event.target.value)}
        >
          <MenuItem value="">All statuses</MenuItem>
          {PRODUCT_STATUS_OPTIONS.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Typography variant="caption" color="text.secondary">
        SKU and text search are not available on the product list API yet.
      </Typography>
    </Box>
  );
}
