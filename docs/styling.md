# Styling conventions

## MUI

- Global look and feel comes from `src/theme/index.js` (palette, typography, component defaults).
- Interactive controls, feedback (Alert, Snackbar), and dense data UI should use MUI components.
- Prefer `sx` for one-off component tuning tied to the theme.

## Tailwind

- Tailwind is configured with **`corePlugins.preflight: false`** so base styles do not fight MUI `CssBaseline`.
- Use Tailwind on layout wrappers: flex/grid, gap, min-height, responsive padding.
- Avoid applying Tailwind utility classes directly on MUI `TextField`, `Button`, or `Input` internals.

## Confirmations vs toasts

- **SweetAlert2** (`src/utils/confirmDialog.js`): destructive or irreversible actions only.
- **Snackbar** (`NotificationProvider`): routine success/error/info messages.
