import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useCreateTenant } from '../../hooks/tenants/useTenantMutations.js';
import { getUserFacingMessage } from '../../services/api/apiError.js';
import { mapValidationDetailsToFieldErrors } from '../../utils/mapValidationDetails.js';

export function TenantRegisterPage() {
  const [slug, setSlug] = useState('');
  const [name, setName] = useState('');
  const [fieldErrors, setFieldErrors] = useState(/** @type {Record<string, string>} */ ({}));
  const [createdTenant, setCreatedTenant] = useState(
    /** @type {import('../../services/api/tenantsService.js').Tenant | null} */ (null),
  );
  const [formError, setFormError] = useState('');

  const createMutation = useCreateTenant();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError('');
    setCreatedTenant(null);
    const next = {};
    if (!slug.trim()) next.slug = 'Slug is required.';
    if (!name.trim()) next.name = 'Name is required.';
    setFieldErrors(next);
    if (Object.keys(next).length > 0) return;

    try {
      const tenant = await createMutation.mutateAsync({ slug: slug.trim(), name: name.trim() });
      setCreatedTenant(tenant);
    } catch (error) {
      const mapped = mapValidationDetailsToFieldErrors(error?.validationDetails);
      if (Object.keys(mapped).length > 0) setFieldErrors(mapped);
      setFormError(getUserFacingMessage(error));
    }
  };

  return (
    <Box className="mx-auto flex max-w-md flex-col gap-4 p-4">
      <Typography variant="h1" component="h1" sx={{ fontSize: 24 }}>
        Create tenant
      </Typography>
      <Typography variant="body2" color="text.secondary">
        POST /tenants is public on the Nexora API. Use this to bootstrap a new organization before inviting users.
      </Typography>

      {formError ? <Alert severity="error">{formError}</Alert> : null}

      {createdTenant ? (
        <Alert severity="success">
          Tenant created: <strong>{createdTenant.name}</strong> ({createdTenant.slug}). ID:{' '}
          <Typography component="span" fontFamily="monospace" fontSize={12}>
            {createdTenant.id}
          </Typography>
        </Alert>
      ) : null}

      <Box component="form" onSubmit={handleSubmit} noValidate className="flex flex-col gap-3">
        <TextField
          label="Slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          error={Boolean(fieldErrors.slug)}
          helperText={fieldErrors.slug ?? 'URL-safe identifier (max 63 characters)'}
          required
          fullWidth
          size="small"
        />
        <TextField
          label="Display name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={Boolean(fieldErrors.name)}
          helperText={fieldErrors.name}
          required
          fullWidth
          size="small"
        />
        <Button type="submit" variant="contained" disabled={createMutation.isPending}>
          Create tenant
        </Button>
      </Box>

      <Button component={RouterLink} to="/login" size="small">
        Back to sign in
      </Button>
    </Box>
  );
}
