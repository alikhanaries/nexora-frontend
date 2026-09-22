import { ORDER_STATUS } from './orderCatalog.js';

/** @type {Record<string, { label: string, muiColor: 'success' | 'default' | 'warning' | 'info' | 'error' }>} */
export const orderStatusPresentation = {
  [ORDER_STATUS.NEW]: { label: 'New', muiColor: 'info' },
  [ORDER_STATUS.CONFIRMED]: { label: 'Confirmed', muiColor: 'success' },
  [ORDER_STATUS.PROCESSING]: { label: 'Processing', muiColor: 'info' },
  [ORDER_STATUS.READY_TO_SHIP]: { label: 'Ready to ship', muiColor: 'info' },
  [ORDER_STATUS.SHIPPED]: { label: 'Shipped', muiColor: 'success' },
  [ORDER_STATUS.DELIVERED]: { label: 'Delivered', muiColor: 'success' },
  [ORDER_STATUS.CANCELLED]: { label: 'Cancelled', muiColor: 'default' },
  [ORDER_STATUS.RETURNED]: { label: 'Returned', muiColor: 'warning' },
};

export function getOrderStatusPresentation(status) {
  return orderStatusPresentation[status] ?? { label: status, muiColor: 'default' };
}
