import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { useMarketplaces } from '../../hooks/marketplaces/useMarketplaceQueries.js';
import { getUserFacingMessage } from '../../services/api/apiError.js';
import { mapValidationDetailsToFieldErrors } from '../../utils/mapValidationDetails.js';

const emptyCreateValues = {
  marketplaceId: '',
  name: '',
  externalReference: '',
  configurationReference: '',
};

/**
 * @param {{
 *   mode: 'create' | 'edit',
 *   initialValues?: Partial<typeof emptyCreateValues & { status?: string, marketplaceId?: string }>,
 *   isSubmitting: boolean,
 *   onSubmit: (values: Record<string, unknown>) => Promise<void>,
 *   onCancel: () => void,
 * }} props
 */
export function ChannelForm({ mode, initialValues, isSubmitting, onSubmit, onCancel }) {
  const { data: marketplaces, isLoading: marketplacesLoading } = useMarketplaces({ status: 'ACTIVE' });
  const [values, setValues] = useState({ ...emptyCreateValues, ...initialValues });
  const [fieldErrors, setFieldErrors] = useState(/** @type {Record<string, string>} */ ({}));
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (initialValues) {
      setValues((prev) => ({ ...prev, ...initialValues }));
    }
  }, [initialValues]);

  const uuidPattern =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  const validate = () => {
    const next = {};
    if (mode === 'create') {
      if (!values.marketplaceId) next.marketplaceId = 'Marketplace is required.';
      else if (!uuidPattern.test(values.marketplaceId)) next.marketplaceId = 'Select a valid marketplace.';
    }
    if (!values.name?.trim()) next.name = 'Name is required.';
    else if (values.name.length > 256) next.name = 'Name must be 256 characters or fewer.';
    if (values.externalReference && values.externalReference.length > 256) {
      next.externalReference = 'External reference must be 256 characters or fewer.';
    }
    if (values.configurationReference && values.configurationReference.length > 512) {
      next.configurationReference = 'Configuration reference must be 512 characters or fewer.';
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
            marketplaceId: values.marketplaceId,
            name: values.name.trim(),
            ...(values.externalReference.trim()
              ? { externalReference: values.externalReference.trim() }
              : {}),
            ...(values.configurationReference.trim()
              ? { configurationReference: values.configurationReference.trim() }
              : {}),
          }
        : {
            name: values.name.trim(),
            externalReference: values.externalReference.trim() ? values.externalReference.trim() : null,
            configurationReference: values.configurationReference.trim()
              ? values.configurationReference.trim()
              : null,
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
      {mode === 'create' ? (
        <FormControl size="small" fullWidth error={Boolean(fieldErrors.marketplaceId)}>
          <InputLabel id="channel-marketplace">Marketplace</InputLabel>
          <Select
            labelId="channel-marketplace"
            label="Marketplace"
            value={values.marketplaceId}
            onChange={(event) => setValues((prev) => ({ ...prev, marketplaceId: event.target.value }))}
            disabled={marketplacesLoading}
            required
          >
            <MenuItem value="">
              <em>Select marketplace</em>
            </MenuItem>
            {(marketplaces ?? []).map((marketplace) => (
              <MenuItem key={marketplace.id} value={marketplace.id}>
                {marketplace.name} ({marketplace.key})
              </MenuItem>
            ))}
          </Select>
          {fieldErrors.marketplaceId ? (
            <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
              {fieldErrors.marketplaceId}
            </Typography>
          ) : null}
        </FormControl>
      ) : (
        <TextField
          label="Marketplace"
          value={values.marketplaceLabel ?? values.marketplaceId ?? ''}
          fullWidth
          size="small"
          disabled
          helperText="Marketplace cannot be changed after creation."
        />
      )}
      <TextField
        label="Name"
        name="name"
        value={values.name}
        onChange={(event) => setValues((prev) => ({ ...prev, name: event.target.value }))}
        required
        fullWidth
        size="small"
        error={Boolean(fieldErrors.name)}
        helperText={fieldErrors.name}
      />
      <TextField
        label="External reference"
        name="externalReference"
        value={values.externalReference ?? ''}
        onChange={(event) => setValues((prev) => ({ ...prev, externalReference: event.target.value }))}
        fullWidth
        size="small"
        error={Boolean(fieldErrors.externalReference)}
        helperText={fieldErrors.externalReference || 'Optional merchant reference for this channel.'}
      />
      <TextField
        label="Configuration reference"
        name="configurationReference"
        value={values.configurationReference ?? ''}
        onChange={(event) =>
          setValues((prev) => ({ ...prev, configurationReference: event.target.value }))
        }
        fullWidth
        size="small"
        error={Boolean(fieldErrors.configurationReference)}
        helperText={
          fieldErrors.configurationReference ||
          'Optional pointer to stored integration configuration (not credentials).'
        }
      />
      <Box className="flex flex-wrap gap-2 pt-2">
        <Button type="submit" variant="contained" size="small" disabled={isSubmitting}>
          {mode === 'create' ? 'Create channel' : 'Save changes'}
        </Button>
        <Button type="button" variant="outlined" size="small" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
      </Box>
    </Box>
  );
}
