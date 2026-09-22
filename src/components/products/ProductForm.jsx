import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import { useEffect, useState } from 'react';
import { PRODUCT_TYPE, PRODUCT_TYPE_OPTIONS } from '../../constants/productCatalog.js';
import { mapValidationDetailsToFieldErrors } from '../../utils/mapValidationDetails.js';
import { getUserFacingMessage } from '../../services/api/apiError.js';

const emptyCreateValues = {
  merchantSku: '',
  externalReference: '',
  productType: PRODUCT_TYPE.STANDARD,
};

/**
 * @param {{
 *   mode: 'create' | 'edit',
 *   initialValues?: Partial<typeof emptyCreateValues & { merchantSku: string }>,
 *   isSubmitting: boolean,
 *   onSubmit: (values: Record<string, unknown>) => Promise<void>,
 *   onCancel: () => void,
 * }} props
 */
export function ProductForm({ mode, initialValues, isSubmitting, onSubmit, onCancel }) {
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
    if (mode === 'create' && !values.merchantSku.trim()) {
      next.merchantSku = 'Merchant SKU is required.';
    } else if (mode === 'create' && values.merchantSku.length > 128) {
      next.merchantSku = 'Merchant SKU must be 128 characters or fewer.';
    }
    if (values.externalReference && values.externalReference.length > 256) {
      next.externalReference = 'External reference must be 256 characters or fewer.';
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
            merchantSku: values.merchantSku.trim(),
            ...(values.externalReference.trim()
              ? { externalReference: values.externalReference.trim() }
              : {}),
            productType: values.productType,
          }
        : {
            ...(values.externalReference !== undefined
              ? { externalReference: values.externalReference.trim() || null }
              : {}),
            productType: values.productType,
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
          label="Merchant SKU"
          name="merchantSku"
          value={values.merchantSku}
          onChange={(event) => setValues((prev) => ({ ...prev, merchantSku: event.target.value }))}
          required
          fullWidth
          size="small"
          error={Boolean(fieldErrors.merchantSku)}
          helperText={fieldErrors.merchantSku}
        />
      ) : (
        <TextField
          label="Merchant SKU"
          value={values.merchantSku}
          fullWidth
          size="small"
          disabled
          helperText="SKU cannot be changed after creation."
        />
      )}
      <TextField
        label="External reference"
        name="externalReference"
        value={values.externalReference ?? ''}
        onChange={(event) => setValues((prev) => ({ ...prev, externalReference: event.target.value }))}
        fullWidth
        size="small"
        error={Boolean(fieldErrors.externalReference)}
        helperText={fieldErrors.externalReference || 'Optional channel or ERP reference.'}
      />
      <FormControl fullWidth size="small">
        <InputLabel id="product-type-label">Product type</InputLabel>
        <Select
          labelId="product-type-label"
          label="Product type"
          value={values.productType}
          onChange={(event) => setValues((prev) => ({ ...prev, productType: event.target.value }))}
        >
          {PRODUCT_TYPE_OPTIONS.map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Box className="mt-2 flex gap-2">
        <Button type="submit" variant="contained" disabled={isSubmitting}>
          {isSubmitting ? 'Saving…' : mode === 'create' ? 'Create product' : 'Save changes'}
        </Button>
        <Button type="button" variant="outlined" disabled={isSubmitting} onClick={onCancel}>
          Cancel
        </Button>
      </Box>
    </Box>
  );
}
