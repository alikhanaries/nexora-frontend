import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useEffect, useState } from 'react';
import { getUserFacingMessage } from '../../services/api/apiError.js';
import { mapValidationDetailsToFieldErrors } from '../../utils/mapValidationDetails.js';
import { minorUnitsToMajorInput, parseMajorUnitsToMinor } from '../../utils/money.js';

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function toDatetimeLocalValue(iso) {
  if (!iso) return '';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  const pad = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function fromDatetimeLocalValue(value) {
  if (!value) return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;
  return date.toISOString();
}

/**
 * @param {{
 *   mode: 'create' | 'edit',
 *   initialValues?: Partial<{ productId: string, currency: string, amountMinor: number, channelId: string|null, validFrom: string, validTo: string|null }>,
 *   isSubmitting: boolean,
 *   onSubmit: (values: Record<string, unknown>) => Promise<void>,
 *   onCancel: () => void,
 * }} props
 */
export function PriceForm({ mode, initialValues, isSubmitting, onSubmit, onCancel }) {
  const [productId, setProductId] = useState(initialValues?.productId ?? '');
  const [currency, setCurrency] = useState(initialValues?.currency ?? '');
  const [amountMajor, setAmountMajor] = useState(
    initialValues?.amountMinor !== undefined ? minorUnitsToMajorInput(initialValues.amountMinor) : '',
  );
  const [channelId, setChannelId] = useState(initialValues?.channelId ?? '');
  const [validFrom, setValidFrom] = useState(toDatetimeLocalValue(initialValues?.validFrom));
  const [validTo, setValidTo] = useState(toDatetimeLocalValue(initialValues?.validTo ?? undefined));
  const [fieldErrors, setFieldErrors] = useState(/** @type {Record<string, string>} */ ({}));
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (!initialValues) return;
    setProductId(initialValues.productId ?? '');
    setCurrency(initialValues.currency ?? '');
    if (initialValues.amountMinor !== undefined) {
      setAmountMajor(minorUnitsToMajorInput(initialValues.amountMinor));
    }
    setChannelId(initialValues.channelId ?? '');
    setValidFrom(toDatetimeLocalValue(initialValues.validFrom));
    setValidTo(toDatetimeLocalValue(initialValues.validTo ?? undefined));
  }, [initialValues]);

  const validate = () => {
    const next = {};
    if (mode === 'create') {
      if (!UUID_PATTERN.test(productId.trim())) next.productId = 'Enter a valid product UUID.';
      if (!/^[A-Za-z]{3}$/.test(currency.trim())) next.currency = 'Currency must be a 3-letter ISO code.';
    }
    const minor = parseMajorUnitsToMinor(amountMajor);
    if (minor === null || minor <= 0) next.amountMajor = 'Enter a valid amount greater than zero.';
    if (channelId.trim() && !UUID_PATTERN.test(channelId.trim())) {
      next.channelId = 'Channel ID must be a valid UUID or empty.';
    }
    setFieldErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;
    setFormError('');

    const amountMinor = parseMajorUnitsToMinor(amountMajor);
    if (amountMinor === null) return;

    const payload =
      mode === 'create'
        ? {
            productId: productId.trim(),
            currency: currency.trim().toUpperCase(),
            amountMinor,
            ...(channelId.trim() ? { channelId: channelId.trim() } : { channelId: null }),
            ...(validFrom ? { validFrom: fromDatetimeLocalValue(validFrom) } : {}),
            ...(validTo ? { validTo: fromDatetimeLocalValue(validTo) } : { validTo: null }),
          }
        : {
            amountMinor,
            ...(channelId.trim() ? { channelId: channelId.trim() } : { channelId: null }),
            ...(validFrom ? { validFrom: fromDatetimeLocalValue(validFrom) } : {}),
            ...(validTo ? { validTo: fromDatetimeLocalValue(validTo) } : { validTo: null }),
          };

    try {
      await onSubmit(payload);
    } catch (error) {
      setFieldErrors(mapValidationDetailsToFieldErrors(error?.validationDetails));
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
        <>
          <TextField
            label="Product ID"
            value={productId}
            onChange={(event) => setProductId(event.target.value)}
            required
            size="small"
            fullWidth
            error={Boolean(fieldErrors.productId)}
            helperText={fieldErrors.productId || 'UUID of the product from the Products module.'}
          />
          <TextField
            label="Currency"
            value={currency}
            onChange={(event) => setCurrency(event.target.value.toUpperCase())}
            required
            size="small"
            fullWidth
            inputProps={{ maxLength: 3 }}
            error={Boolean(fieldErrors.currency)}
            helperText={fieldErrors.currency || 'Three-letter ISO 4217 code from the API contract.'}
          />
        </>
      ) : null}
      <TextField
        label="Amount (major units)"
        value={amountMajor}
        onChange={(event) => setAmountMajor(event.target.value)}
        required
        size="small"
        fullWidth
        error={Boolean(fieldErrors.amountMajor)}
        helperText={
          fieldErrors.amountMajor ||
          'Entered as decimal major units; stored and sent as integer amountMinor (×100).'
        }
      />
      <TextField
        label="Channel ID"
        value={channelId}
        onChange={(event) => setChannelId(event.target.value)}
        size="small"
        fullWidth
        error={Boolean(fieldErrors.channelId)}
        helperText={fieldErrors.channelId || 'Optional channel-specific price UUID.'}
      />
      <TextField
        label="Valid from"
        type="datetime-local"
        value={validFrom}
        onChange={(event) => setValidFrom(event.target.value)}
        size="small"
        fullWidth
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        label="Valid to"
        type="datetime-local"
        value={validTo}
        onChange={(event) => setValidTo(event.target.value)}
        size="small"
        fullWidth
        InputLabelProps={{ shrink: true }}
      />
      <Box className="mt-2 flex gap-2">
        <Button type="submit" variant="contained" disabled={isSubmitting}>
          {isSubmitting ? 'Saving…' : mode === 'create' ? 'Create price' : 'Save changes'}
        </Button>
        <Button type="button" variant="outlined" disabled={isSubmitting} onClick={onCancel}>
          Cancel
        </Button>
      </Box>
    </Box>
  );
}
