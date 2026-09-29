import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormHelperText from '@mui/material/FormHelperText';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useMemo, useState } from 'react';
import { usePermissionsCatalog } from '../../hooks/permissions/usePermissionQueries.js';
import { getUserFacingMessage } from '../../services/api/apiError.js';
import { mapValidationDetailsToFieldErrors } from '../../utils/mapValidationDetails.js';

/**
 * @param {{
 *   isSubmitting: boolean,
 *   onSubmit: (values: { name: string, permissionKeys: string[] }) => Promise<void>,
 *   onCancel: () => void,
 * }} props
 */
export function RoleForm({ isSubmitting, onSubmit, onCancel }) {
  const { data: permissions, isLoading: permissionsLoading } = usePermissionsCatalog();
  const [name, setName] = useState('');
  const [selectedKeys, setSelectedKeys] = useState(/** @type {string[]} */ ([]));
  const [fieldErrors, setFieldErrors] = useState(/** @type {Record<string, string>} */ ({}));
  const [formError, setFormError] = useState('');

  const sortedPermissions = useMemo(
    () => [...(permissions ?? [])].sort((a, b) => a.key.localeCompare(b.key)),
    [permissions],
  );

  const toggleKey = (key) => {
    setSelectedKeys((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
  };

  const validate = () => {
    const next = {};
    if (!name.trim()) next.name = 'Name is required.';
    else if (name.length > 128) next.name = 'Name must be 128 characters or fewer.';
    if (selectedKeys.length === 0) next.permissionKeys = 'Select at least one permission.';
    setFieldErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;
    setFormError('');
    try {
      await onSubmit({ name: name.trim(), permissionKeys: selectedKeys });
    } catch (error) {
      const mapped = mapValidationDetailsToFieldErrors(error?.validationDetails);
      if (Object.keys(mapped).length > 0) setFieldErrors(mapped);
      setFormError(getUserFacingMessage(error));
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate className="flex max-w-xl flex-col gap-3">
      {formError ? <Alert severity="error">{formError}</Alert> : null}
      <TextField
        label="Role name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={Boolean(fieldErrors.name)}
        helperText={fieldErrors.name}
        required
        fullWidth
        size="small"
      />
      <FormControl error={Boolean(fieldErrors.permissionKeys)} component="fieldset" variant="standard">
        <Typography variant="subtitle2" gutterBottom>
          Permissions
        </Typography>
        {permissionsLoading ? (
          <Typography variant="body2" color="text.secondary">
            Loading permission catalog…
          </Typography>
        ) : (
          <FormGroup sx={{ maxHeight: 320, overflow: 'auto' }}>
            {sortedPermissions.map((permission) => (
              <FormControlLabel
                key={permission.id}
                control={
                  <Checkbox
                    size="small"
                    checked={selectedKeys.includes(permission.key)}
                    onChange={() => toggleKey(permission.key)}
                  />
                }
                label={
                  <span>
                    <Typography component="span" variant="body2" fontFamily="monospace">
                      {permission.key}
                    </Typography>
                    {permission.description ? (
                      <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                        — {permission.description}
                      </Typography>
                    ) : null}
                  </span>
                }
              />
            ))}
          </FormGroup>
        )}
        {fieldErrors.permissionKeys ? <FormHelperText>{fieldErrors.permissionKeys}</FormHelperText> : null}
      </FormControl>
      <Box className="flex gap-2">
        <Button type="submit" variant="contained" size="small" disabled={isSubmitting || permissionsLoading}>
          Create role
        </Button>
        <Button type="button" variant="outlined" size="small" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
      </Box>
    </Box>
  );
}
