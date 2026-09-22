import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import { CHANNEL_STATUS_OPTIONS } from '../../constants/channelCatalog.js';
import { useMarketplaces } from '../../hooks/marketplaces/useMarketplaceQueries.js';

/**
 * Backend list filters: status, marketplaceId only.
 * @param {{
 *   status: string,
 *   marketplaceId: string,
 *   onChange: (field: string, value: string) => void,
 *   onReset: () => void,
 *   hasFilters: boolean,
 * }} props
 */
export function ChannelFilters({ status, marketplaceId, onChange, onReset, hasFilters }) {
  const { data: marketplaces } = useMarketplaces();

  return (
    <Box className="mb-4 flex flex-col gap-3">
      <Box className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <FormControl size="small">
          <InputLabel id="channel-status-filter">Status</InputLabel>
          <Select
            labelId="channel-status-filter"
            label="Status"
            value={status}
            onChange={(event) => onChange('status', event.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            {CHANNEL_STATUS_OPTIONS.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small">
          <InputLabel id="channel-marketplace-filter">Marketplace</InputLabel>
          <Select
            labelId="channel-marketplace-filter"
            label="Marketplace"
            value={marketplaceId}
            onChange={(event) => onChange('marketplaceId', event.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            {(marketplaces ?? []).map((marketplace) => (
              <MenuItem key={marketplace.id} value={marketplace.id}>
                {marketplace.name} ({marketplace.key})
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
