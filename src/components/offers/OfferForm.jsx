import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import { useEffect, useState } from 'react';
import { LISTING_STATUS_OPTIONS } from '../../constants/offerCatalog.js';
import { useChannels } from '../../hooks/channels/useChannelQueries.js';
import { getUserFacingMessage } from '../../services/api/apiError.js';
import { mapValidationDetailsToFieldErrors } from '../../utils/mapValidationDetails.js';

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * @param {{
 *   mode: 'create' | 'edit',
 *   initialValues?: Partial<{
 *     productId: string,
 *     channelId: string,
 *     externalReference: string|null,
 *     priceReference: string|null,
 *     listingStatus: string,
 *   }>,
 *   isSubmitting: boolean,
 *   onSubmit: (values: Record<string, unknown>) => Promise<void>,
 *   onCancel: () => void,
 * }} props
 */
export function OfferForm({ mode, initialValues, isSubmitting, onSubmit, onCancel }) {
  const { data: channels, isLoading: channelsLoading } = useChannels();
  const [productId, setProductId] = useState(initialValues?.productId ?? '');
  const [channelId, setChannelId] = useState(initialValues?.channelId ?? '');
  const [externalReference, setExternalReference] = useState(initialValues?.externalReference ?? '');
  const [priceReference, setPriceReference] = useState(initialValues?.priceReference ?? '');
  const [listingStatus, setListingStatus] = useState(initialValues?.listingStatus ?? '');
  const [fieldErrors, setFieldErrors] = useState(/** @type {Record<string, string>} */ ({}));
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (!initialValues) return;
    setProductId(initialValues.productId ?? '');
    setChannelId(initialValues.channelId ?? '');
    setExternalReference(initialValues.externalReference ?? '');
    setPriceReference(initialValues.priceReference ?? '');
    setListingStatus(initialValues.listingStatus ?? '');
  }, [initialValues]);

  const validate = () => {
    const next = {};
    if (mode === 'create') {
      if (!UUID_PATTERN.test(productId.trim())) next.productId = 'Enter a valid product UUID.';
      if (!UUID_PATTERN.test(channelId.trim())) next.channelId = 'Select or enter a valid channel UUID.';
    }
    if (priceReference.trim() && !UUID_PATTERN.test(priceReference.trim())) {
      next.priceReference = 'Price reference must be a valid UUID or empty.';
    }
    if (externalReference.length > 256) {
      next.externalReference = 'External reference must be at most 256 characters.';
    }
    setFieldErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;
    setFormError('');

    const trimmedExternal = externalReference.trim();
    const trimmedPrice = priceReference.trim();

    const payload =
      mode === 'create'
        ? {
            productId: productId.trim(),
            channelId: channelId.trim(),
            ...(trimmedExternal ? { externalReference: trimmedExternal } : { externalReference: null }),
            ...(trimmedPrice ? { priceReference: trimmedPrice } : { priceReference: null }),
          }
        : {
            externalReference: trimmedExternal ? trimmedExternal : null,
            priceReference: trimmedPrice ? trimmedPrice : null,
            ...(listingStatus ? { listingStatus } : {}),
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
            fullWidth
            size="small"
            error={Boolean(fieldErrors.productId)}
            helperText={fieldErrors.productId || 'UUID from your product catalog.'}
          />
          <FormControl fullWidth size="small" error={Boolean(fieldErrors.channelId)}>
            <InputLabel id="offer-channel-select">Channel</InputLabel>
            <Select
              labelId="offer-channel-select"
              label="Channel"
              value={channelId}
              onChange={(event) => setChannelId(event.target.value)}
              disabled={channelsLoading}
            >
              {(channels ?? []).map((channel) => (
                <MenuItem key={channel.id} value={channel.id}>
                  {channel.name} ({channel.status})
                </MenuItem>
              ))}
            </Select>
            {fieldErrors.channelId ? (
              <Box component="span" sx={{ color: 'error.main', fontSize: 12, mt: 0.5 }}>
                {fieldErrors.channelId}
              </Box>
            ) : (
              <Box component="span" sx={{ color: 'text.secondary', fontSize: 12, mt: 0.5 }}>
                {channels?.length
                  ? 'Channels loaded from GET /channels.'
                  : 'No channels returned — create a channel via API or enter UUID below.'}
              </Box>
            )}
          </FormControl>
          {!channels?.length ? (
            <TextField
              label="Channel ID (UUID)"
              value={channelId}
              onChange={(event) => setChannelId(event.target.value)}
              fullWidth
              size="small"
              error={Boolean(fieldErrors.channelId)}
            />
          ) : null}
        </>
      ) : null}
      <TextField
        label="External reference"
        value={externalReference}
        onChange={(event) => setExternalReference(event.target.value)}
        fullWidth
        size="small"
        error={Boolean(fieldErrors.externalReference)}
        helperText={fieldErrors.externalReference || 'Optional marketplace listing reference.'}
      />
      <TextField
        label="Price reference"
        value={priceReference}
        onChange={(event) => setPriceReference(event.target.value)}
        fullWidth
        size="small"
        error={Boolean(fieldErrors.priceReference)}
        helperText={fieldErrors.priceReference || 'Optional UUID linking to a price record.'}
      />
      {mode === 'edit' ? (
        <FormControl fullWidth size="small">
          <InputLabel id="offer-listing-status">Listing status</InputLabel>
          <Select
            labelId="offer-listing-status"
            label="Listing status"
            value={listingStatus}
            onChange={(event) => setListingStatus(event.target.value)}
          >
            {LISTING_STATUS_OPTIONS.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ) : null}
      <Box className="flex flex-wrap gap-2 pt-2">
        <Button type="submit" variant="contained" disabled={isSubmitting}>
          {isSubmitting ? 'Saving…' : mode === 'create' ? 'Create offer' : 'Save changes'}
        </Button>
        <Button type="button" variant="outlined" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
      </Box>
    </Box>
  );
}
