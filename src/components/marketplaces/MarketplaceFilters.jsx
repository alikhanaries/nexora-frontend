import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import { MARKETPLACE_STATUS_OPTIONS } from '../../constants/marketplaceCatalog.js';

/**
 * Backend list filters: status only.
 * @param {{
 *   status: string,
 *   onChange: (field: string, value: string) => void,
 *   onReset: () => void,
 *   hasFilters: boolean,
 * }} props
 */
export function MarketplaceFilters({ status, onChange, onReset, hasFilters }) {
  return (
    <Box className="mb-4 flex flex-col gap-3">
      <Box className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <FormControl size="small">
          <InputLabel id="marketplace-status-filter">Status</InputLabel>
          <Select
            labelId="marketplace-status-filter"
            label="Status"
            value={status}
            onChange={(event) => onChange('status', event.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            {MARKETPLACE_STATUS_OPTIONS.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {hasFilters ? (
          <Box className="flex items-center">
            <Button size="small" onClick={onReset}>
              Reset filters
            </Button>
          </Box>
        ) : null}
      </Box>
      <Typography variant="caption" color="text.secondary">
        Filters match backend query parameters. List returns the full result set (no pagination).
      </Typography>
    </Box>
  );
}
