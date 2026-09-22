import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import { getLoginErrorMessage } from '../../utils/authErrorMessage.js';

const initialValues = {
  tenantSlug: '',
  email: '',
  password: '',
};

/**
 * @param {{ onSubmit: (values: typeof initialValues) => Promise<void> }} props
 */
export function LoginForm({ onSubmit }) {
  const [values, setValues] = useState(initialValues);
  const [fieldErrors, setFieldErrors] = useState(/** @type {Record<string, string>} */ ({}));
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validate = () => {
    const next = {};
    if (!values.tenantSlug.trim()) next.tenantSlug = 'Tenant slug is required.';
    if (!values.email.trim()) next.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
      next.email = 'Enter a valid email address.';
    }
    if (!values.password) next.password = 'Password is required.';
    setFieldErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleChange = (field) => (event) => {
    setValues((prev) => ({ ...prev, [field]: event.target.value }));
    setFieldErrors((prev) => ({ ...prev, [field]: '' }));
    setSubmitError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitError('');
    try {
      await onSubmit({
        tenantSlug: values.tenantSlug.trim(),
        email: values.email.trim(),
        password: values.password,
      });
    } catch (error) {
      setSubmitError(getLoginErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate className="flex flex-col gap-3">
      {submitError ? (
        <Alert severity="error" variant="outlined">
          {submitError}
        </Alert>
      ) : null}
      <TextField
        label="Tenant slug"
        name="tenantSlug"
        value={values.tenantSlug}
        onChange={handleChange('tenantSlug')}
        error={Boolean(fieldErrors.tenantSlug)}
        helperText={fieldErrors.tenantSlug}
        autoComplete="organization"
        required
        fullWidth
        size="small"
      />
      <TextField
        label="Email"
        name="email"
        type="email"
        value={values.email}
        onChange={handleChange('email')}
        error={Boolean(fieldErrors.email)}
        helperText={fieldErrors.email}
        autoComplete="username"
        required
        fullWidth
        size="small"
      />
      <TextField
        label="Password"
        name="password"
        type={showPassword ? 'text' : 'password'}
        value={values.password}
        onChange={handleChange('password')}
        error={Boolean(fieldErrors.password)}
        helperText={fieldErrors.password}
        autoComplete="current-password"
        required
        fullWidth
        size="small"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                onClick={() => setShowPassword((prev) => !prev)}
                edge="end"
                size="small"
              >
                {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <Button type="submit" variant="contained" fullWidth disabled={isSubmitting} sx={{ mt: 1 }}>
        {isSubmitting ? 'Signing in…' : 'Sign in'}
      </Button>
    </Box>
  );
}
