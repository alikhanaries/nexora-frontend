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
import { useMemo, useState } from 'react';
import { API_KEY_TYPE, API_KEY_TYPE_OPTIONS } from '../../constants/apiKeyCatalog.js';
import { usePermissionsCatalog } from '../../hooks/permissions/usePermissionQueries.js';
import { getUserFacingMessage } from '../../services/api/apiError.js';
import { mapValidationDetailsToFieldErrors } from '../../utils/mapValidationDetails.js';

/**
 * @param {{
 *   isSubmitting: boolean,
 *   onSubmit: (values: Record<string, unknown>) => Promise<void>,
 *   onCancel: () => void,
 * }} props
 */
export function ApiKeyForm({ isSubmitting, onSubmit, onCancel }) {
  const { data: permissions, isLoading: permissionsLoading } = usePermissionsCatalog();
  const [name, setName] = useState('');
  const [keyType, setKeyType] = useState(API_KEY_TYPE.STANDARD);
  const [expiresAt, setExpiresAt] = useState('');
  const [selectedScopes, setSelectedScopes] = useState(/** @type {string[]} */ ([]));
  const [fieldErrors, setFieldErrors] = useState(/** @type {Record<string, string>} */ ({}));
  const [formError, setFormError] = useState('');

  const sortedPermissions = useMemo(
    () => [...(permissions ?? [])].sort((a, b) => a.key.localeCompare(b.key)),
    [permissions],
  );

  const toggleScope = (scopeKey) => {
    setSelectedScopes((prev) =>
      prev.includes(scopeKey) ? prev.filter((key) => key !== scopeKey) : [...prev, scopeKey],
    );
  };

  const validate = () => {
    const next = {};
    if (!name.trim()) next.name = 'Name is required.';
    else if (name.length > 128) next.name = 'Name must be 128 characters or fewer.';
    if (selectedScopes.length === 0) next.scopes = 'Select at least one scope.';
    setFieldErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;
    setFormError('');

    const payload = {
      name: name.trim(),
      scopes: selectedScopes,
      ...(keyType ? { keyType } : {}),
      ...(expiresAt ? { expiresAt: new Date(expiresAt).toISOString() } : {}),
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
        label="Name"
        name="name"
        value={name}
        onChange={(event) => setName(event.target.value)}
        required
        fullWidth
        size="small"
        error={Boolean(fieldErrors.name)}
        helperText={fieldErrors.name || 'A label to identify this key in your tenant.'}
        inputProps={{ maxLength: 128 }}
      />
      <FormControl size="small" fullWidth>
        <InputLabel id="api-key-type">Key type</InputLabel>
        <Select
          labelId="api-key-type"
          label="Key type"
          value={keyType}
          onChange={(event) => setKeyType(event.target.value)}
        >
          {API_KEY_TYPE_OPTIONS.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        label="Expires at"
        name="expiresAt"
        type="datetime-local"
        value={expiresAt}
        onChange={(event) => setExpiresAt(event.target.value)}
        fullWidth
        size="small"
        InputLabelProps={{ shrink: true }}
        helperText="Optional. Leave empty for no expiration."
      />
      <FormControl component="fieldset" error={Boolean(fieldErrors.scopes)} disabled={permissionsLoading}>
        <Typography component="legend" variant="subtitle2" sx={{ mb: 1 }}>
          Scopes
        </Typography>
        <FormHelperText sx={{ mt: 0, mb: 1 }}>
          Permission keys granted to this API key. Backend validates scopes against your account permissions.
        </FormHelperText>
        {permissionsLoading ? (
          <Typography variant="body2" color="text.secondary">
            Loading permission catalog…
          </Typography>
        ) : sortedPermissions.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No permissions available to assign.
          </Typography>
        ) : (
          <FormGroup className="max-h-64 overflow-y-auto rounded border border-solid border-gray-200 p-2">
            {sortedPermissions.map((permission) => (
              <FormControlLabel
                key={permission.id}
                control={
                  <Checkbox
                    size="small"
                    checked={selectedScopes.includes(permission.key)}
                    onChange={() => toggleScope(permission.key)}
                  />
                }
                label={
                  <Box>
                    <Typography variant="body2" fontFamily="monospace">
                      {permission.key}
                    </Typography>
                    {permission.description ? (
                      <Typography variant="caption" color="text.secondary">
                        {permission.description}
                      </Typography>
                    ) : null}
                  </Box>
                }
              />
            ))}
          </FormGroup>
        )}
        {fieldErrors.scopes ? <FormHelperText error>{fieldErrors.scopes}</FormHelperText> : null}
      </FormControl>
      <Box className="flex flex-wrap gap-2 pt-2">
        <Button type="submit" variant="contained" size="small" disabled={isSubmitting || permissionsLoading}>
          Create API key
        </Button>
        <Button type="button" variant="outlined" size="small" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
      </Box>
    </Box>
  );
}
