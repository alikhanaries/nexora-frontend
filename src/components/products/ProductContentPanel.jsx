import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import Skeleton from '@mui/material/Skeleton';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  isValidProductContentLocale,
  PRODUCT_CONTENT_FIELD_LIMITS,
  PRODUCT_CONTENT_LOCALE_HINT,
} from '../../constants/productLocale.js';
import { PERMISSIONS } from '../../constants/permissions.js';
import { useUpsertProductContent } from '../../hooks/products/useProductMutations.js';
import { useProductContent } from '../../hooks/products/useProduct.js';
import { usePermissions } from '../../hooks/permissions/usePermissions.js';
import { useNotification } from '../../hooks/useNotification.js';
import { getUserFacingMessage } from '../../services/api/apiError.js';
import { ErrorState } from '../ui/ErrorState.jsx';
import { EmptyState } from '../ui/EmptyState.jsx';
import { mapValidationDetailsToFieldErrors } from '../../utils/mapValidationDetails.js';
import { canShowPermissionAction } from '../../utils/permissionAction.js';
import { formatDate } from '../../utils/formatDate.js';

const NEW_LOCALE_VALUE = '__new__';

/**
 * @typedef {import('../../services/api/productsService.js').ProductContent} ProductContent
 */

/**
 * @param {ProductContent | null | undefined} entry
 */
function formStateFromEntry(entry) {
  if (!entry) {
    return {
      title: '',
      description: '',
      brand: '',
      attributesJson: '{\n}',
    };
  }
  const attributes = entry.attributes && typeof entry.attributes === 'object' ? entry.attributes : {};
  return {
    title: entry.title ?? '',
    description: entry.description ?? '',
    brand: entry.brand ?? '',
    attributesJson: JSON.stringify(attributes, null, 2),
  };
}

/**
 * @param {ReturnType<typeof formStateFromEntry>} form
 */
function serializeFormForCompare(form) {
  return JSON.stringify({
    title: form.title,
    description: form.description,
    brand: form.brand,
    attributesJson: form.attributesJson.trim(),
  });
}

/**
 * @param {string} productId
 */
export function ProductContentPanel({ productId }) {
  const permission = usePermissions();
  const canEdit = canShowPermissionAction(permission, PERMISSIONS.PRODUCTS_UPDATE);
  const { data: content, isLoading, isError, error, refetch } = useProductContent(productId);
  const upsertMutation = useUpsertProductContent(productId);
  const { notify } = useNotification();

  const sortedLocales = useMemo(() => {
    if (!content?.length) return [];
    return [...content].sort((a, b) => a.locale.localeCompare(b.locale));
  }, [content]);

  const [localeSelection, setLocaleSelection] = useState(NEW_LOCALE_VALUE);
  const [newLocale, setNewLocale] = useState('');
  const [form, setForm] = useState(() => formStateFromEntry(null));
  const [baselineSerialized, setBaselineSerialized] = useState(() => serializeFormForCompare(formStateFromEntry(null)));
  const [fieldErrors, setFieldErrors] = useState(/** @type {Record<string, string>} */ ({}));
  const [formError, setFormError] = useState('');

  const activeLocale =
    localeSelection === NEW_LOCALE_VALUE ? newLocale.trim() : localeSelection;

  const selectedEntry = useMemo(() => {
    if (localeSelection === NEW_LOCALE_VALUE) return null;
    return sortedLocales.find((entry) => entry.locale === localeSelection) ?? null;
  }, [localeSelection, sortedLocales]);

  const loadFormForSelection = useCallback(
    (selection, entries) => {
      if (selection === NEW_LOCALE_VALUE) {
        const next = formStateFromEntry(null);
        setForm(next);
        setBaselineSerialized(serializeFormForCompare(next));
        setNewLocale('');
        return;
      }
      const entry = entries.find((item) => item.locale === selection);
      const next = formStateFromEntry(entry);
      setForm(next);
      setBaselineSerialized(serializeFormForCompare(next));
    },
    [],
  );

  const hasHydratedRef = useRef(false);

  useEffect(() => {
    if (isLoading) return;
    if (hasHydratedRef.current) return;
    hasHydratedRef.current = true;
    if (sortedLocales.length > 0) {
      const firstLocale = sortedLocales[0].locale;
      setLocaleSelection(firstLocale);
      loadFormForSelection(firstLocale, sortedLocales);
    } else {
      loadFormForSelection(NEW_LOCALE_VALUE, []);
    }
  }, [isLoading, sortedLocales, loadFormForSelection]);

  const isDirty = serializeFormForCompare(form) !== baselineSerialized;

  const handleLocaleChange = (event) => {
    const next = event.target.value;
    if (isDirty && !window.confirm('You have unsaved changes. Switch locale anyway?')) {
      return;
    }
    setFieldErrors({});
    setFormError('');
    setLocaleSelection(next);
    loadFormForSelection(next, sortedLocales);
    if (next !== NEW_LOCALE_VALUE) {
      setNewLocale('');
    }
  };

  const validate = () => {
    const next = {};
    const locale = activeLocale;
    if (!locale) {
      next.locale = 'Locale is required.';
    } else if (!isValidProductContentLocale(locale)) {
      next.locale = PRODUCT_CONTENT_LOCALE_HINT;
    }
    if (form.title.length > PRODUCT_CONTENT_FIELD_LIMITS.title) {
      next.title = `Title must be ${PRODUCT_CONTENT_FIELD_LIMITS.title} characters or fewer.`;
    }
    if (form.description.length > PRODUCT_CONTENT_FIELD_LIMITS.description) {
      next.description = `Description must be ${PRODUCT_CONTENT_FIELD_LIMITS.description} characters or fewer.`;
    }
    if (form.brand.length > PRODUCT_CONTENT_FIELD_LIMITS.brand) {
      next.brand = `Brand must be ${PRODUCT_CONTENT_FIELD_LIMITS.brand} characters or fewer.`;
    }
    let parsedAttributes = {};
    try {
      const parsed = JSON.parse(form.attributesJson || '{}');
      if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
        next.attributesJson = 'Attributes must be a JSON object.';
      } else {
        parsedAttributes = parsed;
      }
    } catch {
      next.attributesJson = 'Attributes must be valid JSON.';
    }
    setFieldErrors(next);
    return { valid: Object.keys(next).length === 0, parsedAttributes, locale };
  };

  const handleReset = () => {
    setFieldErrors({});
    setFormError('');
    loadFormForSelection(localeSelection, sortedLocales);
  };

  const handleSave = async () => {
    setFormError('');
    const { valid, parsedAttributes, locale } = validate();
    if (!valid || !locale) return;

    const payload = {
      title: form.title.trim() || null,
      description: form.description.trim() || null,
      brand: form.brand.trim() || null,
      attributes: parsedAttributes,
    };

    try {
      await upsertMutation.mutateAsync({ locale, body: payload });
      notify(`Content saved for ${locale}.`, 'success');
      setLocaleSelection(locale);
      setNewLocale('');
      const savedForm = { ...form };
      setBaselineSerialized(serializeFormForCompare(savedForm));
    } catch (saveError) {
      const mapped = mapValidationDetailsToFieldErrors(saveError?.validationDetails);
      if (Object.keys(mapped).length > 0) {
        setFieldErrors(mapped);
      }
      setFormError(getUserFacingMessage(saveError));
    }
  };

  if (isLoading) {
    return (
      <Paper className="p-4">
        <Skeleton variant="text" width="40%" />
        <Skeleton variant="rounded" height={160} sx={{ mt: 2 }} />
      </Paper>
    );
  }

  if (isError) {
    return (
      <ErrorState
        error={error}
        title={error?.httpStatus === 403 ? 'Unable to view product content' : 'Unable to load product content'}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <Paper className="p-4">
      <Box className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
        <Box>
          <Typography variant="h3" component="h2" gutterBottom>
            Content and localization
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Merchandising copy is stored per locale. The API does not expose a locale catalog — enter any supported
            BCP-47 code when adding a translation.
          </Typography>
        </Box>
      </Box>

      {!canEdit ? (
        <Alert severity="info" variant="outlined" sx={{ mb: 2 }}>
          You do not have permission to update product content. Fields are read-only.
        </Alert>
      ) : null}

      {formError ? (
        <Alert severity="error" variant="outlined" sx={{ mb: 2 }}>
          {formError}
        </Alert>
      ) : null}

      <Box className="mb-3 flex flex-col gap-3 md:flex-row md:items-end">
        <FormControl fullWidth size="small" sx={{ maxWidth: { md: 280 } }}>
          <InputLabel id="product-content-locale-label">Locale</InputLabel>
          <Select
            labelId="product-content-locale-label"
            label="Locale"
            value={localeSelection}
            onChange={handleLocaleChange}
          >
            {sortedLocales.map((entry) => (
              <MenuItem key={entry.locale} value={entry.locale}>
                {entry.locale}
              </MenuItem>
            ))}
            <MenuItem value={NEW_LOCALE_VALUE}>Add locale…</MenuItem>
          </Select>
        </FormControl>
        {localeSelection === NEW_LOCALE_VALUE ? (
          <TextField
            label="New locale"
            value={newLocale}
            onChange={(event) => setNewLocale(event.target.value)}
            size="small"
            fullWidth
            disabled={!canEdit}
            error={Boolean(fieldErrors.locale)}
            helperText={fieldErrors.locale || PRODUCT_CONTENT_LOCALE_HINT}
            sx={{ maxWidth: { md: 280 } }}
          />
        ) : null}
      </Box>

      {sortedLocales.length === 0 && localeSelection === NEW_LOCALE_VALUE ? (
        <EmptyState
          title="No localized content yet"
          description="Add a locale below to create the first content entry for this product."
        />
      ) : null}

      <Box component="fieldset" disabled={!canEdit || upsertMutation.isPending} className="flex flex-col gap-3 border-0 p-0 m-0 min-w-0">
        <TextField
          label="Title"
          value={form.title}
          onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
          fullWidth
          size="small"
          error={Boolean(fieldErrors.title)}
          helperText={fieldErrors.title}
          inputProps={{ maxLength: PRODUCT_CONTENT_FIELD_LIMITS.title + 1 }}
        />
        <TextField
          label="Description"
          value={form.description}
          onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
          fullWidth
          size="small"
          multiline
          minRows={4}
          error={Boolean(fieldErrors.description)}
          helperText={fieldErrors.description}
          inputProps={{ maxLength: PRODUCT_CONTENT_FIELD_LIMITS.description + 1 }}
        />
        <TextField
          label="Brand"
          value={form.brand}
          onChange={(event) => setForm((prev) => ({ ...prev, brand: event.target.value }))}
          fullWidth
          size="small"
          error={Boolean(fieldErrors.brand)}
          helperText={fieldErrors.brand}
          inputProps={{ maxLength: PRODUCT_CONTENT_FIELD_LIMITS.brand + 1 }}
        />
        <TextField
          label="Attributes (JSON)"
          value={form.attributesJson}
          onChange={(event) => setForm((prev) => ({ ...prev, attributesJson: event.target.value }))}
          fullWidth
          size="small"
          multiline
          minRows={6}
          error={Boolean(fieldErrors.attributesJson)}
          helperText={
            fieldErrors.attributesJson ||
            'Flexible key/value metadata for this locale. Must be a JSON object — not used for SKU, price, or stock.'
          }
          slotProps={{
            input: {
              sx: { fontFamily: 'ui-monospace, monospace', fontSize: '0.8125rem' },
            },
          }}
        />
      </Box>

      {selectedEntry ? (
        <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 2 }}>
          Last updated {formatDate(selectedEntry.updatedAt)}
        </Typography>
      ) : null}

      {canEdit ? (
        <Box className="mt-3 flex flex-wrap gap-2">
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={upsertMutation.isPending || !isDirty}
          >
            {upsertMutation.isPending ? 'Saving…' : 'Save content'}
          </Button>
          <Button variant="outlined" onClick={handleReset} disabled={upsertMutation.isPending || !isDirty}>
            Reset
          </Button>
        </Box>
      ) : null}
    </Paper>
  );
}
