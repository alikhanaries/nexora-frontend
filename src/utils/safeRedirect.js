/**
 * @param {unknown} path
 * @returns {string}
 */
export function getSafeRedirectPath(path) {
  if (typeof path !== 'string' || path.length === 0) {
    return '/';
  }
  if (!path.startsWith('/') || path.startsWith('//')) {
    return '/';
  }
  if (path.startsWith('/login')) {
    return '/';
  }
  return path;
}
