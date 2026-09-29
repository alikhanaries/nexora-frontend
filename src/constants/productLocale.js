/** Matches backend `productLocaleParamsSchema` / domain `validateLocale`. */
export const PRODUCT_CONTENT_LOCALE_PATTERN = /^[a-z]{2}(-[A-Z]{2})?$/;

/** @param {string} locale */
export function isValidProductContentLocale(locale) {
  return typeof locale === 'string' && PRODUCT_CONTENT_LOCALE_PATTERN.test(locale.trim());
}

export const PRODUCT_CONTENT_FIELD_LIMITS = {
  title: 512,
  description: 8192,
  brand: 256,
};

export const PRODUCT_CONTENT_LOCALE_HINT = 'BCP-47 locale code, e.g. en or en-US.';
