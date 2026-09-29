/** Mirrors backend return-status.js */
export const RETURN_STATUS = {
  REQUESTED: 'REQUESTED',
  APPROVED: 'APPROVED',
  RECEIVED: 'RECEIVED',
  COMPLETED: 'COMPLETED',
  REJECTED: 'REJECTED',
  CANCELLED: 'CANCELLED',
};

export const RETURN_STATUS_OPTIONS = [
  RETURN_STATUS.REQUESTED,
  RETURN_STATUS.APPROVED,
  RETURN_STATUS.RECEIVED,
  RETURN_STATUS.COMPLETED,
  RETURN_STATUS.REJECTED,
  RETURN_STATUS.CANCELLED,
];

export const DEFAULT_RETURN_LIST_LIMIT = 25;

export function canApproveReturn(status) {
  return status === RETURN_STATUS.REQUESTED;
}

export function canRejectReturn(status) {
  return status === RETURN_STATUS.REQUESTED;
}

export function canCancelReturn(status) {
  return status === RETURN_STATUS.REQUESTED || status === RETURN_STATUS.APPROVED;
}

export function canReceiveReturn(status) {
  return status === RETURN_STATUS.APPROVED;
}

export function canCompleteReturn(status) {
  return status === RETURN_STATUS.RECEIVED;
}
