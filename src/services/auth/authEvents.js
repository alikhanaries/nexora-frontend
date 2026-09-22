const listeners = new Set();

export function subscribeAuthSession(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function notifyAuthSessionChanged() {
  listeners.forEach((listener) => listener());
}
