import { RETURN_STATUS } from './returnCatalog.js';

/** @type {Record<string, { label: string, muiColor: 'success' | 'default' | 'warning' | 'info' | 'error' }>} */
export const returnStatusPresentation = {
  [RETURN_STATUS.REQUESTED]: { label: 'Requested', muiColor: 'info' },
  [RETURN_STATUS.APPROVED]: { label: 'Approved', muiColor: 'info' },
  [RETURN_STATUS.RECEIVED]: { label: 'Received', muiColor: 'success' },
  [RETURN_STATUS.COMPLETED]: { label: 'Completed', muiColor: 'success' },
  [RETURN_STATUS.REJECTED]: { label: 'Rejected', muiColor: 'warning' },
  [RETURN_STATUS.CANCELLED]: { label: 'Cancelled', muiColor: 'default' },
};

export function getReturnStatusPresentation(status) {
  return returnStatusPresentation[status] ?? { label: status, muiColor: 'default' };
}
