import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { ORDER_STATUS_OPTIONS } from '../../constants/orderCatalog.js';
import { useChannels } from '../../hooks/channels/useChannelQueries.js';

function toDatetimeLocalValue(iso) {
  if (!iso) return '';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  const pad = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function fromDatetimeLocalValue(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString();
}

/**
 * Backend list filters only — no SKU/customer search.
 * @param {{
 *   status: string,
 *   channelId: string,
 *   externalOrderReference: string,
 *   orderNumber: string,
 *   createdAfter: string,
 *   createdBefore: string,
 *   onChange: (field: string, value: string) => void,
 * }} props
 */
export function OrderFilters({
  status,
  channelId,
  externalOrderReference,
  orderNumber,
  createdAfter,
  createdBefore,
  onChange,
}) {
  const { data: channels } = useChannels();

  return (
    <Box className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <FormControl size="small">
        <InputLabel id="order-status-filter">Status</InputLabel>
        <Select
          labelId="order-status-filter"
          label="Status"
          value={status}
          onChange={(event) => onChange('status', event.target.value)}
        >
          <MenuItem value="">All</MenuItem>
          {ORDER_STATUS_OPTIONS.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl size="small">
        <InputLabel id="order-channel-filter">Channel</InputLabel>
        <Select
          labelId="order-channel-filter"
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
      <TextField
        label="Order number"
        size="small"
        value={orderNumber}
        onChange={(event) => onChange('orderNumber', event.target.value)}
      />
      <TextField
        label="External reference"
        size="small"
        value={externalOrderReference}
        onChange={(event) => onChange('externalOrderReference', event.target.value)}
      />
      <TextField
        label="Created after"
        type="datetime-local"
        size="small"
        value={toDatetimeLocalValue(createdAfter)}
        onChange={(event) => onChange('createdAfter', fromDatetimeLocalValue(event.target.value))}
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        label="Created before"
        type="datetime-local"
        size="small"
        value={toDatetimeLocalValue(createdBefore)}
        onChange={(event) => onChange('createdBefore', fromDatetimeLocalValue(event.target.value))}
        InputLabelProps={{ shrink: true }}
      />
      <Typography variant="caption" color="text.secondary" className="sm:col-span-2 lg:col-span-3">
        Date filters are sent as ISO datetimes in UTC derived from your local datetime input.
      </Typography>
    </Box>
  );
}
