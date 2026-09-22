import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { OFFER_STATUS_OPTIONS } from '../../constants/offerCatalog.js';
import { useChannels } from '../../hooks/channels/useChannelQueries.js';

/**
 * Backend list filters: productId, channelId, status — no SKU/text search.
 * @param {{
 *   productId: string,
 *   channelId: string,
 *   status: string,
 *   onChange: (field: string, value: string) => void,
 * }} props
 */
export function OfferFilters({ productId, channelId, status, onChange }) {
  const { data: channels } = useChannels();

  return (
    <Box className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <TextField
        label="Product ID"
        size="small"
        value={productId}
        onChange={(event) => onChange('productId', event.target.value)}
        placeholder="UUID"
      />
      <FormControl size="small">
        <InputLabel id="offer-channel-filter">Channel</InputLabel>
        <Select
          labelId="offer-channel-filter"
          label="Channel"
          value={channelId}
          onChange={(event) => onChange('channelId', event.target.value)}
        >
          <MenuItem value="">All</MenuItem>
          {(channels ?? []).map((channel) => (
            <MenuItem key={channel.id} value={channel.id}>
              {channel.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl size="small">
        <InputLabel id="offer-status-filter">Status</InputLabel>
        <Select
          labelId="offer-status-filter"
          label="Status"
          value={status}
          onChange={(event) => onChange('status', event.target.value)}
        >
          <MenuItem value="">All</MenuItem>
          {OFFER_STATUS_OPTIONS.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Typography variant="caption" color="text.secondary" className="sm:col-span-2 lg:col-span-3">
        Filters match backend query parameters only. One offer per product and channel pair.
      </Typography>
    </Box>
  );
}
