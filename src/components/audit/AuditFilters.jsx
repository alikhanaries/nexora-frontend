import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import { AUDIT_EVENT_TYPES } from '../../constants/auditCatalog.js';
import { formatAuditEventLabel } from '../../constants/auditEventPresentation.js';

/**
 * @param {{
 *   eventType: string,
 *   onChange: (field: string, value: string) => void,
 *   onReset: () => void,
 *   hasFilters: boolean,
 * }} props
 */
export function AuditFilters({ eventType, onChange, onReset, hasFilters }) {
  return (
    <Box className="mb-4 flex flex-col gap-3">
      <Box className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <FormControl size="small">
          <InputLabel id="audit-event-type-filter">Event type</InputLabel>
          <Select
            labelId="audit-event-type-filter"
            label="Event type"
            value={eventType}
            onChange={(event) => onChange('eventType', event.target.value)}
          >
            <MenuItem value="">All events</MenuItem>
            {AUDIT_EVENT_TYPES.map((type) => (
              <MenuItem key={type} value={type}>
                {formatAuditEventLabel(type)}
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
        Filters and pagination use URL query parameters. Listing is read-only (offset + limit).
      </Typography>
    </Box>
  );
}
