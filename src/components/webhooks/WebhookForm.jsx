import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { WEBHOOK_SUBSCRIPTION_STATUS, WEBHOOK_SUBSCRIPTION_STATUS_OPTIONS } from '../../constants/webhookCatalog.js';
import { WEBHOOK_DELIVERABLE_EVENT_TYPES } from '../../constants/webhookEventCatalog.js';
import { getUserFacingMessage } from '../../services/api/apiError.js';
import { mapValidationDetailsToFieldErrors } from '../../utils/mapValidationDetails.js';

/**
 * @param {{
 *   mode: 'create' | 'edit',
 *   initialValues?: { url?: string, description?: string, eventTypes?: string[], status?: string },
 *   isSubmitting: boolean,
 *   onSubmit: (values: Record<string, unknown>) => Promise<void>,
 *   onCancel: () => void,
 * }} props
 */
export function WebhookForm({ mode, initialValues, isSubmitting, onSubmit, onCancel }) {
  const [values, setValues] = useState({
    url: '',
    description: '',
    eventTypes: /** @type {string[]} */ ([]),
    status: WEBHOOK_SUBSCRIPTION_STATUS.ACTIVE,
    ...initialValues,
  });
  const [fieldErrors, setFieldErrors] = useState(/** @type {Record<string, string>} */ ({}));
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (initialValues) {
      setValues((prev) => ({
        ...prev,
        ...initialValues,
        description: initialValues.description ?? '',
        eventTypes: initialValues.eventTypes ?? [],
      }));
    }
  }, [initialValues]);

  const toggleEvent = (eventType) => {
    setValues((prev) => ({
      ...prev,
      eventTypes: prev.eventTypes.includes(eventType)
        ? prev.eventTypes.filter((item) => item !== eventType)
        : [...prev.eventTypes, eventType],
    }));
  };

  const validate = () => {
    const next = {};
    if (mode === 'create' || values.url !== undefined) {
      if (!values.url?.trim()) next.url = 'Endpoint URL is required.';
      else {
        try {
          const parsed = new URL(values.url.trim());
          if (!['http:', 'https:'].includes(parsed.protocol)) {
            next.url = 'URL must use http or https.';
          }
        } catch {
          next.url = 'Enter a valid URL.';
        }
      }
      if (values.url && values.url.length > 2048) next.url = 'URL must be 2048 characters or fewer.';
    }
    if (values.description && values.description.length > 512) {
      next.description = 'Description must be 512 characters or fewer.';
    }
    if (mode === 'create' || values.eventTypes) {
      if (!values.eventTypes?.length) next.eventTypes = 'Select at least one event type.';
    }
    setFieldErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;
    setFormError('');

    const payload =
      mode === 'create'
        ? {
            url: values.url.trim(),
            eventTypes: values.eventTypes,
            ...(values.description.trim() ? { description: values.description.trim() } : {}),
          }
        : {
            ...(values.url !== undefined ? { url: values.url.trim() } : {}),
            eventTypes: values.eventTypes,
            description: values.description.trim() ? values.description.trim() : null,
            ...(values.status ? { status: values.status } : {}),
          };

    try {
      await onSubmit(payload);
    } catch (error) {
      const mapped = mapValidationDetailsToFieldErrors(error?.validationDetails);
      if (Object.keys(mapped).length > 0) {
        setFieldErrors(mapped);
      }
      setFormError(getUserFacingMessage(error));
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate className="flex max-w-xl flex-col gap-3">
      {formError ? (
        <Alert severity="error" variant="outlined">
          {formError}
        </Alert>
      ) : null}
      <TextField
        label="Endpoint URL"
        name="url"
        value={values.url}
        onChange={(event) => setValues((prev) => ({ ...prev, url: event.target.value }))}
        required
        fullWidth
        size="small"
        error={Boolean(fieldErrors.url)}
        helperText={fieldErrors.url || 'HTTPS endpoint that receives signed webhook POSTs.'}
      />
      <TextField
        label="Description"
        name="description"
        value={values.description ?? ''}
        onChange={(event) => setValues((prev) => ({ ...prev, description: event.target.value }))}
        fullWidth
        size="small"
        error={Boolean(fieldErrors.description)}
        helperText={fieldErrors.description || 'Optional internal label.'}
        inputProps={{ maxLength: 512 }}
      />
      <FormControl component="fieldset" error={Boolean(fieldErrors.eventTypes)}>
        <Typography component="legend" variant="subtitle2" sx={{ mb: 1 }}>
          Event types
        </Typography>
        <FormHelperText sx={{ mt: 0, mb: 1 }}>
          Values mirror the backend external delivery catalog (validated server-side).
        </FormHelperText>
        <FormGroup className="max-h-64 overflow-y-auto rounded border border-solid border-gray-200 p-2">
          {WEBHOOK_DELIVERABLE_EVENT_TYPES.map((eventType) => (
            <FormControlLabel
              key={eventType}
              control={
                <Checkbox
                  size="small"
                  checked={values.eventTypes.includes(eventType)}
                  onChange={() => toggleEvent(eventType)}
                />
              }
              label={
                <Typography variant="body2" fontFamily="monospace">
                  {eventType}
                </Typography>
              }
            />
          ))}
        </FormGroup>
        {fieldErrors.eventTypes ? <FormHelperText error>{fieldErrors.eventTypes}</FormHelperText> : null}
      </FormControl>
      {mode === 'edit' ? (
        <FormControl size="small" fullWidth>
          <InputLabel id="webhook-status">Status</InputLabel>
          <Select
            labelId="webhook-status"
            label="Status"
            value={values.status}
            onChange={(event) => setValues((prev) => ({ ...prev, status: event.target.value }))}
          >
            {WEBHOOK_SUBSCRIPTION_STATUS_OPTIONS.filter(
              (option) => option !== WEBHOOK_SUBSCRIPTION_STATUS.DELETED,
            ).map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ) : null}
      <Box className="flex flex-wrap gap-2 pt-2">
        <Button type="submit" variant="contained" size="small" disabled={isSubmitting}>
          {mode === 'create' ? 'Create webhook' : 'Save changes'}
        </Button>
        <Button type="button" variant="outlined" size="small" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
      </Box>
    </Box>
  );
}
