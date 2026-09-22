import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { MAX_ORDER_LINES } from '../../constants/orderCatalog.js';
import { useChannels } from '../../hooks/channels/useChannelQueries.js';
import { useStockLocations } from '../../hooks/inventory/useInventoryQueries.js';
import { getUserFacingMessage } from '../../services/api/apiError.js';
import { mapValidationDetailsToFieldErrors } from '../../utils/mapValidationDetails.js';
import { parseMajorUnitsToMinor } from '../../utils/money.js';

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function emptyLine() {
  return { productId: '', stockLocationId: '', quantity: '1', offerId: '' };
}

/**
 * @param {{
 *   isSubmitting: boolean,
 *   onSubmit: (payload: { body: Record<string, unknown>, idempotencyKey: string }) => Promise<void>,
 *   onCancel: () => void,
 *   idempotencyKey: string,
 * }} props
 */
export function OrderForm({ isSubmitting, onSubmit, onCancel, idempotencyKey }) {
  const { data: channels, isLoading: channelsLoading } = useChannels();
  const { data: stockLocations, isLoading: locationsLoading } = useStockLocations();

  const [channelId, setChannelId] = useState('');
  const [currency, setCurrency] = useState('');
  const [externalOrderReference, setExternalOrderReference] = useState('');
  const [lines, setLines] = useState([emptyLine()]);
  const [discountMajor, setDiscountMajor] = useState('');
  const [taxMajor, setTaxMajor] = useState('');
  const [shippingMajor, setShippingMajor] = useState('');
  const [customerFirstName, setCustomerFirstName] = useState('');
  const [customerLastName, setCustomerLastName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [fieldErrors, setFieldErrors] = useState(/** @type {Record<string, string>} */ ({}));
  const [formError, setFormError] = useState('');

  const updateLine = (index, field, value) => {
    setLines((prev) => prev.map((line, i) => (i === index ? { ...line, [field]: value } : line)));
  };

  const addLine = () => {
    if (lines.length >= MAX_ORDER_LINES) return;
    setLines((prev) => [...prev, emptyLine()]);
  };

  const removeLine = (index) => {
    if (lines.length <= 1) return;
    setLines((prev) => prev.filter((_, i) => i !== index));
  };

  const validate = () => {
    const next = {};
    if (!UUID_PATTERN.test(channelId.trim())) next.channelId = 'Select a channel.';
    if (!/^[A-Za-z]{3}$/.test(currency.trim())) next.currency = 'Currency must be a 3-letter ISO code.';

    lines.forEach((line, index) => {
      if (!UUID_PATTERN.test(line.productId.trim())) {
        next[`lines.${index}.productId`] = 'Valid product UUID required.';
      }
      if (!UUID_PATTERN.test(line.stockLocationId.trim())) {
        next[`lines.${index}.stockLocationId`] = 'Select a stock location.';
      }
      const qty = Number(line.quantity);
      if (!Number.isInteger(qty) || qty <= 0) {
        next[`lines.${index}.quantity`] = 'Quantity must be a positive integer.';
      }
      if (line.offerId.trim() && !UUID_PATTERN.test(line.offerId.trim())) {
        next[`lines.${index}.offerId`] = 'Offer ID must be a valid UUID or empty.';
      }
    });

    const optionalMinor = (value, key) => {
      if (!value.trim()) return undefined;
      const minor = parseMajorUnitsToMinor(value);
      if (minor === null || minor < 0) next[key] = 'Enter a valid non-negative amount.';
      return minor ?? undefined;
    };
    optionalMinor(discountMajor, 'discountMajor');
    optionalMinor(taxMajor, 'taxMajor');
    optionalMinor(shippingMajor, 'shippingMajor');

    if (customerEmail.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail.trim())) {
      next.customerEmail = 'Enter a valid email or leave empty.';
    }

    setFieldErrors(next);
    return Object.keys(next).length === 0;
  };

  const buildPayload = () => {
    const discountMinor = discountMajor.trim() ? parseMajorUnitsToMinor(discountMajor) : undefined;
    const taxMinor = taxMajor.trim() ? parseMajorUnitsToMinor(taxMajor) : undefined;
    const shippingMinor = shippingMajor.trim() ? parseMajorUnitsToMinor(shippingMajor) : undefined;

    const mappedLines = lines.map((line) => ({
      productId: line.productId.trim(),
      stockLocationId: line.stockLocationId.trim(),
      quantity: Number(line.quantity),
      ...(line.offerId.trim() ? { offerId: line.offerId.trim() } : {}),
    }));

    const hasCustomer =
      customerFirstName.trim() ||
      customerLastName.trim() ||
      customerEmail.trim() ||
      customerPhone.trim();

    const customer = hasCustomer
      ? {
          ...(customerFirstName.trim() ? { firstName: customerFirstName.trim() } : {}),
          ...(customerLastName.trim() ? { lastName: customerLastName.trim() } : {}),
          ...(customerEmail.trim() ? { email: customerEmail.trim() } : {}),
          ...(customerPhone.trim() ? { phone: customerPhone.trim() } : {}),
        }
      : undefined;

    return {
      channelId: channelId.trim(),
      currency: currency.trim().toUpperCase(),
      lines: mappedLines,
      ...(externalOrderReference.trim()
        ? { externalOrderReference: externalOrderReference.trim() }
        : { externalOrderReference: null }),
      ...(discountMinor !== undefined && discountMinor !== null ? { discountMinor } : {}),
      ...(taxMinor !== undefined && taxMinor !== null ? { taxMinor } : {}),
      ...(shippingMinor !== undefined && shippingMinor !== null ? { shippingMinor } : {}),
      ...(customer ? { customer } : {}),
    };
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;
    setFormError('');

    try {
      await onSubmit({ body: buildPayload(), idempotencyKey });
    } catch (error) {
      setFieldErrors(mapValidationDetailsToFieldErrors(error?.validationDetails));
      setFormError(getUserFacingMessage(error));
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate className="flex max-w-3xl flex-col gap-4">
      {formError ? (
        <Alert severity="error" variant="outlined">
          {formError}
        </Alert>
      ) : null}

      <Typography variant="subtitle2">Order</Typography>
      <Box className="grid gap-3 sm:grid-cols-2">
        <FormControl size="small" error={Boolean(fieldErrors.channelId)}>
          <InputLabel id="order-channel">Channel</InputLabel>
          <Select
            labelId="order-channel"
            label="Channel"
            value={channelId}
            onChange={(event) => setChannelId(event.target.value)}
            disabled={channelsLoading}
          >
            {(channels ?? []).map((channel) => (
              <MenuItem key={channel.id} value={channel.id}>
                {channel.name}
              </MenuItem>
            ))}
          </Select>
          {fieldErrors.channelId ? (
            <Typography variant="caption" color="error">
              {fieldErrors.channelId}
            </Typography>
          ) : null}
        </FormControl>
        <TextField
          label="Currency"
          size="small"
          value={currency}
          onChange={(event) => setCurrency(event.target.value.toUpperCase())}
          inputProps={{ maxLength: 3 }}
          error={Boolean(fieldErrors.currency)}
          helperText={fieldErrors.currency || '3-letter ISO code, e.g. USD'}
        />
        <TextField
          label="External order reference"
          size="small"
          className="sm:col-span-2"
          value={externalOrderReference}
          onChange={(event) => setExternalOrderReference(event.target.value)}
        />
      </Box>

      <Divider />

      <Box className="flex items-center justify-between">
        <Typography variant="subtitle2">Line items</Typography>
        <Button
          type="button"
          size="small"
          startIcon={<AddIcon />}
          onClick={addLine}
          disabled={lines.length >= MAX_ORDER_LINES}
        >
          Add line
        </Button>
      </Box>
      <Typography variant="caption" color="text.secondary">
        Product and offer IDs are UUIDs (no SKU search on the API). Pricing is resolved on the backend at create time.
      </Typography>

      {lines.map((line, index) => (
        <Box key={index} className="grid gap-2 rounded border border-neutral-200 p-3 sm:grid-cols-12">
          <TextField
            className="sm:col-span-3"
            label="Product ID"
            size="small"
            value={line.productId}
            onChange={(event) => updateLine(index, 'productId', event.target.value)}
            error={Boolean(fieldErrors[`lines.${index}.productId`])}
            helperText={fieldErrors[`lines.${index}.productId`]}
          />
          <FormControl className="sm:col-span-3" size="small" error={Boolean(fieldErrors[`lines.${index}.stockLocationId`])}>
            <InputLabel id={`stock-loc-${index}`}>Stock location</InputLabel>
            <Select
              labelId={`stock-loc-${index}`}
              label="Stock location"
              value={line.stockLocationId}
              onChange={(event) => updateLine(index, 'stockLocationId', event.target.value)}
              disabled={locationsLoading}
            >
              {(stockLocations ?? []).map((location) => (
                <MenuItem key={location.id} value={location.id}>
                  {location.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            className="sm:col-span-2"
            label="Qty"
            size="small"
            type="number"
            inputProps={{ min: 1, step: 1 }}
            value={line.quantity}
            onChange={(event) => updateLine(index, 'quantity', event.target.value)}
            error={Boolean(fieldErrors[`lines.${index}.quantity`])}
          />
          <TextField
            className="sm:col-span-3"
            label="Offer ID (optional)"
            size="small"
            value={line.offerId}
            onChange={(event) => updateLine(index, 'offerId', event.target.value)}
            error={Boolean(fieldErrors[`lines.${index}.offerId`])}
          />
          <Box className="flex items-start justify-end sm:col-span-1">
            <IconButton
              type="button"
              aria-label="Remove line"
              onClick={() => removeLine(index)}
              disabled={lines.length <= 1}
              size="small"
            >
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      ))}

      <Divider />

      <Typography variant="subtitle2">Order charges (optional)</Typography>
      <Typography variant="caption" color="text.secondary">
        Enter decimal amounts; submitted as integer minor units.
      </Typography>
      <Box className="grid gap-3 sm:grid-cols-3">
        <TextField
          label="Discount"
          size="small"
          value={discountMajor}
          onChange={(event) => setDiscountMajor(event.target.value)}
          error={Boolean(fieldErrors.discountMajor)}
        />
        <TextField
          label="Tax"
          size="small"
          value={taxMajor}
          onChange={(event) => setTaxMajor(event.target.value)}
          error={Boolean(fieldErrors.taxMajor)}
        />
        <TextField
          label="Shipping"
          size="small"
          value={shippingMajor}
          onChange={(event) => setShippingMajor(event.target.value)}
          error={Boolean(fieldErrors.shippingMajor)}
        />
      </Box>

      <Divider />

      <Typography variant="subtitle2">Customer (optional)</Typography>
      <Box className="grid gap-3 sm:grid-cols-2">
        <TextField label="First name" size="small" value={customerFirstName} onChange={(e) => setCustomerFirstName(e.target.value)} />
        <TextField label="Last name" size="small" value={customerLastName} onChange={(e) => setCustomerLastName(e.target.value)} />
        <TextField
          label="Email"
          size="small"
          value={customerEmail}
          onChange={(e) => setCustomerEmail(e.target.value)}
          error={Boolean(fieldErrors.customerEmail)}
          helperText={fieldErrors.customerEmail}
        />
        <TextField label="Phone" size="small" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} />
      </Box>

      <Box className="flex flex-wrap gap-2 pt-2">
        <Button type="submit" variant="contained" disabled={isSubmitting}>
          {isSubmitting ? 'Creating…' : 'Create order'}
        </Button>
        <Button type="button" variant="outlined" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
      </Box>
      <Typography variant="caption" color="text.secondary">
        Idempotency key for this submission: {idempotencyKey.slice(0, 8)}… (fixed until you leave this page)
      </Typography>
    </Box>
  );
}
