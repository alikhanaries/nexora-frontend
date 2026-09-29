import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useEffect, useState } from 'react';
import { getUserFacingMessage } from '../../services/api/apiError.js';
import { mapValidationDetailsToFieldErrors } from '../../utils/mapValidationDetails.js';

const emptyCreateValues = {
  key: '',
  name: '',
};

/**
 * @param {{
 *   mode: 'create' | 'edit',
 *   initialValues?: Partial<typeof emptyCreateValues>,
 *   isSubmitting: boolean,
 *   onSubmit: (values: Record<string, unknown>) => Promise<void>,
 *   onCancel: () => void,
 * }} props
 */
export function MarketplaceForm({ mode, initialValues, isSubmitting, onSubmit, onCancel }) {
  const [values, setValues] = useState({ ...emptyCreateValues, ...initialValues });
  const [fieldErrors, setFieldErrors] = useState(/** @type {Record<string, string>} */ ({}));
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (initialValues) {
      setValues((prev) => ({ ...prev, ...initialValues }));
    }
  }, [initialValues]);

  const validate = () => {
    const next = {};
    if (mode === 'create') {
      if (!values.key?.trim()) next.key = 'Key is required.';
      else if (values.key.length > 63) next.key = 'Key must be 63 characters or fewer.';
    }
    if (!values.name?.trim()) next.name = 'Name is required.';
    else if (values.name.length > 256) next.name = 'Name must be 256 characters or fewer.';
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
            key: values.key.trim(),
            name: values.name.trim(),
          }
        : {
            name: values.name.trim(),
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
        <TextField
          label="Key"
          name="key"
          value={values.key}
          onChange={(event) => setValues((prev) => ({ ...prev, key: event.target.value }))}
          required
          fullWidth
          size="small"
          error={Boolean(fieldErrors.key)}
          helperText={fieldErrors.key || 'Stable identifier (max 63 characters). Cannot be changed after creation.'}
          inputProps={{ maxLength: 63 }}
        />
      ) : (
        <TextField
          label="Key"
          value={values.key}
          fullWidth
          size="small"
          disabled
          helperText="Marketplace key cannot be changed after creation."
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
        inputProps={{ maxLength: 256 }}
      />
      <Box className="flex flex-wrap gap-2 pt-2">
        <Button type="submit" variant="contained" size="small" disabled={isSubmitting}>
          {mode === 'create' ? 'Create marketplace' : 'Save changes'}
        </Button>
        <Button type="button" variant="outlined" size="small" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
      </Box>
    </Box>
  );
}
