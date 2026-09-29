/**
 * Normalizes GET /auth/me (and forward-compatible fields) into permission state.
 * Backend today returns id, email, status, tenantId, membershipStatus only — no permissions (GAP-18).
 */

/**
 * @param {import('../services/auth/authService.js').MePayload | null | undefined} me
 */
export function normalizeAuthPrincipal(me) {
  if (!me) {
    return {
      user: null,
      permissions: [],
      roles: [],
      membershipId: null,
      isRbacAvailable: false,
    };
  }

  /** @type {string[] | null} */
  let permissions = null;
  if (Array.isArray(me.permissions)) {
    permissions = me.permissions.filter((key) => typeof key === 'string' && key.length > 0);
  } else if (Array.isArray(me.effectivePermissions)) {
    permissions = me.effectivePermissions.filter((key) => typeof key === 'string' && key.length > 0);
  }

  /** @type {string[]} */
  let roles = [];
  if (Array.isArray(me.roles)) {
    roles = me.roles
      .map((role) => (typeof role === 'string' ? role : role?.name ?? role?.systemKey))
      .filter((value) => typeof value === 'string' && value.length > 0);
  }

  const membershipId = typeof me.membershipId === 'string' ? me.membershipId : null;

  return {
    user: me,
    permissions: permissions ?? [],
    roles,
    membershipId,
    isRbacAvailable: permissions !== null,
  };
}

/**
 * @param {string} permission
 * @param {string[]} granted
 */
export function hasPermission(granted, permission) {
  return granted.includes(permission);
}

/**
 * @param {string[]} required
 * @param {string[]} granted
 */
export function hasAnyPermission(granted, required) {
  return required.some((permission) => hasPermission(granted, permission));
}

/**
 * @param {string[]} required
 * @param {string[]} granted
 */
export function hasAllPermissions(granted, required) {
  return required.every((permission) => hasPermission(granted, permission));
}
