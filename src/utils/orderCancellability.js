import { ORDER_STATUS } from '../constants/orderCatalog.js';

/** Mirrors backend order-status.js isOrderCancellable */
const CANCELLABLE_ORDER_STATUSES = new Set([
  ORDER_STATUS.NEW,
  ORDER_STATUS.CONFIRMED,
  ORDER_STATUS.PROCESSING,
  ORDER_STATUS.READY_TO_SHIP,
]);

/**
 * @param {{ quantity: number, cancelledQuantity: number, shippedQuantity: number }} line
 */
export function getCancellableQuantity(line) {
  return line.quantity - line.cancelledQuantity - line.shippedQuantity;
}

/** @param {string} status */
export function isOrderCancellableStatus(status) {
  return CANCELLABLE_ORDER_STATUSES.has(status);
}

/**
 * @param {Array<{ quantity: number, cancelledQuantity: number, shippedQuantity: number }>} lines
 */
export function orderHasCancellableLines(lines) {
  return lines.some((line) => getCancellableQuantity(line) > 0);
}
