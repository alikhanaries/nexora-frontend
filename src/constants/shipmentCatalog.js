/** Mirrors backend shipment-status.js */
export const SHIPMENT_STATUS = {
  CREATED: 'CREATED',
  READY_TO_SHIP: 'READY_TO_SHIP',
  SHIPPED: 'SHIPPED',
  IN_TRANSIT: 'IN_TRANSIT',
  DELIVERED: 'DELIVERED',
  FAILED: 'FAILED',
  CANCELLED: 'CANCELLED',
};

export const SHIPMENT_STATUS_OPTIONS = [
  SHIPMENT_STATUS.CREATED,
  SHIPMENT_STATUS.READY_TO_SHIP,
  SHIPMENT_STATUS.SHIPPED,
  SHIPMENT_STATUS.IN_TRANSIT,
  SHIPMENT_STATUS.DELIVERED,
  SHIPMENT_STATUS.FAILED,
  SHIPMENT_STATUS.CANCELLED,
];

export const DEFAULT_SHIPMENT_LIST_LIMIT = 25;

/** Matches backend isShipmentCancellable */
export function isShipmentCancellableStatus(status) {
  return status === SHIPMENT_STATUS.CREATED || status === SHIPMENT_STATUS.READY_TO_SHIP;
}

export function canShipShipmentStatus(status) {
  return status === SHIPMENT_STATUS.CREATED || status === SHIPMENT_STATUS.READY_TO_SHIP;
}

export function canDeliverShipmentStatus(status) {
  return status === SHIPMENT_STATUS.SHIPPED || status === SHIPMENT_STATUS.IN_TRANSIT;
}
