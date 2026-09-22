/**
 * Maps backend validation details to field-level messages when available.
 * @param {unknown} validationDetails
 * @returns {Record<string, string>}
 */
export function mapValidationDetailsToFieldErrors(validationDetails) {
  if (!validationDetails || typeof validationDetails !== 'object') {
    return {};
  }

  /** @type {Record<string, string>} */
  const fieldErrors = {};

  if (Array.isArray(validationDetails)) {
    for (const issue of validationDetails) {
      if (issue && typeof issue === 'object' && 'path' in issue && 'message' in issue) {
        const path = Array.isArray(issue.path) ? issue.path.join('.') : String(issue.path);
        fieldErrors[path] = String(issue.message);
      }
    }
    return fieldErrors;
  }

  for (const [key, value] of Object.entries(validationDetails)) {
    if (typeof value === 'string') {
      fieldErrors[key] = value;
    } else if (Array.isArray(value) && value[0]) {
      fieldErrors[key] = String(value[0]);
    }
  }

  return fieldErrors;
}
