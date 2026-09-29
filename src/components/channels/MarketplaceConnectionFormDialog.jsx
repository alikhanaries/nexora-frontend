import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useEffect, useMemo, useState } from 'react';
import { getMarketplaceConnectionFieldSet } from '../../constants/marketplaceConnectionCatalog.js';
import { getUserFacingMessage } from '../../services/api/apiError.js';
import {
  buildMarketplaceConnectionSectionPayload,
  configurationToFormValues,
} from '../../utils/marketplaceConnectionForm.js';
import { mapValidationDetailsToFieldErrors } from '../../utils/mapValidationDetails.js';

/**
 * @param {{
 *   open: boolean,
 *   mode: 'create' | 'edit',
 *   channelName: string,
 *   marketplaceKey: string,
 *   marketplaceLabel: string,
 *   existingConfiguration?: Record<string, unknown>,
 *   isSubmitting: boolean,
 *   onClose: () => void,
 *   onSubmit: (body: { credentials?: Record<string, unknown>, configuration?: Record<string, unknown> }) => Promise<void>,
 * }} props
 */
export function MarketplaceConnectionFormDialog({
  open,
  mode,
  channelName,
  marketplaceKey,
  marketplaceLabel,
  existingConfiguration = {},
  isSubmitting,
  onClose,
  onSubmit,
}) {
  const fieldSet = useMemo(() => getMarketplaceConnectionFieldSet(marketplaceKey), [marketplaceKey]);
  const [credentialValues, setCredentialValues] = useState(/** @type {Record<string, string>} */ ({}));
  const [configurationValues, setConfigurationValues] = useState(/** @type {Record<string, string>} */ ({}));
  const [formError, setFormError] = useState('');
  const [fieldErrors, setFieldErrors] = useState(/** @type {Record<string, string>} */ ({}));

  useEffect(() => {
    if (!open) return;
    setFormError('');
    setFieldErrors({});
    if (!fieldSet) {
      setCredentialValues({});
      setConfigurationValues({});
      return;
    }
    const emptyCredentials = Object.fromEntries(fieldSet.credentials.map((field) => [field.name, '']));
    setCredentialValues(emptyCredentials);
    setConfigurationValues(
      mode === 'edit'
        ? configurationToFormValues(existingConfiguration, fieldSet.configuration)
        : Object.fromEntries(fieldSet.configuration.map((field) => [field.name, field.options?.[0] ?? ''])),
    );
  }, [open, mode, fieldSet, existingConfiguration, marketplaceKey]);

  const handleSubmit = async () => {
    setFormError('');
    setFieldErrors({});
    if (!fieldSet) {
      setFormError('This marketplace is not supported in the connection form. Contact your administrator.');
      return;
    }
    try {
      const formMode = mode === 'create' ? 'create' : 'edit';
      const credentials = buildMarketplaceConnectionSectionPayload(fieldSet.credentials, credentialValues, {
        mode: formMode,
      });
      const configuration = buildMarketplaceConnectionSectionPayload(
        fieldSet.configuration,
        configurationValues,
        { mode: 'create' },
      );
      if (mode === 'create' && Object.keys(credentials).length === 0) {
        setFormError('Enter the required credentials.');
        return;
      }
      const body =
        mode === 'create'
          ? { credentials, ...(Object.keys(configuration).length ? { configuration } : {}) }
          : {
              ...(Object.keys(credentials).length ? { credentials } : {}),
              ...(Object.keys(configuration).length ? { configuration } : {}),
            };
      if (mode === 'edit' && !body.credentials && !body.configuration) {
        setFormError('Update at least one configuration field or provide new credentials.');
        return;
      }
      await onSubmit(body);
    } catch (error) {
      const validation = mapValidationDetailsToFieldErrors(error?.validationDetails);
      if (Object.keys(validation).length > 0) {
        setFieldErrors(validation);
      }
      setFormError(error instanceof Error ? error.message : getUserFacingMessage(error));
    }
  };

  const title = mode === 'create' ? 'Connect marketplace' : 'Configure connection';

  return (
    <Dialog
      open={open}
      onClose={isSubmitting ? undefined : onClose}
      fullWidth
      maxWidth="md"
      aria-labelledby="marketplace-connection-form-title"
    >
      <DialogTitle id="marketplace-connection-form-title">{title}</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" className="mb-3">
          Channel: {channelName} · Marketplace: {marketplaceLabel}
        </Typography>
        {!fieldSet ? (
          <Alert severity="warning">
            No credential field catalog exists for marketplace key &quot;{marketplaceKey}&quot;. The backend may still
            accept a connection, but this UI cannot guide configuration safely.
          </Alert>
        ) : (
          <>
            <Typography variant="subtitle2" className="mb-2">
              Credentials
            </Typography>
            {mode === 'edit' ? (
              <Typography variant="caption" color="text.secondary" display="block" className="mb-2">
                Leave secret fields empty to keep existing stored credentials unchanged.
              </Typography>
            ) : null}
            <div className="mb-4 grid gap-3 sm:grid-cols-2">
              {fieldSet.credentials.map((field) => (
                <TextField
                  key={field.name}
                  label={field.label}
                  size="small"
                  fullWidth
                  type={field.type === 'password' ? 'password' : 'text'}
                  multiline={Boolean(field.multiline)}
                  minRows={field.multiline ? 3 : undefined}
                  value={credentialValues[field.name] ?? ''}
                  onChange={(event) =>
                    setCredentialValues((prev) => ({ ...prev, [field.name]: event.target.value }))
                  }
                  required={mode === 'create' && field.required}
                  helperText={fieldErrors[field.name] ?? field.helperText}
                  error={Boolean(fieldErrors[field.name])}
                  autoComplete="off"
                  inputProps={{ 'aria-label': field.label }}
                />
              ))}
            </div>
            <Typography variant="subtitle2" className="mb-2">
              Configuration
            </Typography>
            <div className="grid gap-3 sm:grid-cols-2">
              {fieldSet.configuration.map((field) =>
                field.type === 'select' ? (
                  <FormControl key={field.name} size="small" fullWidth error={Boolean(fieldErrors[field.name])}>
                    <InputLabel id={`${field.name}-label`}>{field.label}</InputLabel>
                    <Select
                      labelId={`${field.name}-label`}
                      label={field.label}
                      value={configurationValues[field.name] ?? ''}
                      onChange={(event) =>
                        setConfigurationValues((prev) => ({ ...prev, [field.name]: event.target.value }))
                      }
                    >
                      {(field.options ?? []).map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                ) : (
                  <TextField
                    key={field.name}
                    label={field.label}
                    size="small"
                    fullWidth
                    value={configurationValues[field.name] ?? ''}
                    onChange={(event) =>
                      setConfigurationValues((prev) => ({ ...prev, [field.name]: event.target.value }))
                    }
                    required={field.required}
                    placeholder={field.placeholder}
                    helperText={fieldErrors[field.name] ?? field.helperText}
                    error={Boolean(fieldErrors[field.name])}
                    inputProps={{ 'aria-label': field.label }}
                  />
                ),
              )}
            </div>
          </>
        )}
        {formError ? (
          <Alert severity="error" className="mt-3">
            {formError}
          </Alert>
        ) : null}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSubmit} disabled={isSubmitting || !fieldSet}>
          {isSubmitting ? 'Saving…' : mode === 'create' ? 'Connect' : 'Save changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
