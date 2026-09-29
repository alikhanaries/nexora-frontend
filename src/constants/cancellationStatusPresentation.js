import { CANCELLATION_STATUS } from './cancellationCatalog.js';

/** @type {Record<string, { label: string, muiColor: 'success' | 'default' | 'warning' | 'info' | 'error' }>} */
export const cancellationStatusPresentation = {
  [CANCELLATION_STATUS.REQUESTED]: { label: 'Requested', muiColor: 'info' },
  [CANCELLATION_STATUS.COMPLETED]: { label: 'Completed', muiColor: 'success' },
  [CANCELLATION_STATUS.REJECTED]: { label: 'Rejected', muiColor: 'error' },
};

export function getCancellationStatusPresentation(status) {
  return cancellationStatusPresentation[status] ?? { label: status, muiColor: 'default' };
}
