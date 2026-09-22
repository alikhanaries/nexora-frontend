import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

/**
 * Backend list supports optional stockLocationId only — no SKU/text search.
 * @param {{
 *   stockLocationId: string,
 *   onStockLocationChange: (value: string) => void,
 *   locations: import('../../services/api/inventoryService.js').StockLocation[],
 *   locationsLoading?: boolean,
 * }} props
 */
export function InventoryFilters({
  stockLocationId,
  onStockLocationChange,
  locations,
  locationsLoading = false,
}) {
  return (
    <Box className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
      <FormControl size="small" sx={{ minWidth: 240 }} disabled={locationsLoading}>
        <InputLabel id="inventory-location-filter-label">Stock location</InputLabel>
        <Select
          labelId="inventory-location-filter-label"
          id="inventory-location-filter"
          label="Stock location"
          value={stockLocationId}
          onChange={(event) => onStockLocationChange(event.target.value)}
        >
          <MenuItem value="">All locations</MenuItem>
          {locations.map((location) => (
            <MenuItem key={location.id} value={location.id}>
              {location.name}
              {location.externalReference ? ` (${location.externalReference})` : ''}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Typography variant="caption" color="text.secondary">
        Balances are returned in full for the selected scope (no cursor pagination on this API).
        Product SKU is not embedded — product ID links to Products.
      </Typography>
    </Box>
  );
}
