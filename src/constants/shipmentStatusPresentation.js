import { SHIPMENT_STATUS } from './shipmentCatalog.js';

/** @type {Record<string, { label: string, muiColor: 'success' | 'default' | 'warning' | 'info' | 'error' }>} */
export const shipmentStatusPresentation = {
  [SHIPMENT_STATUS.CREATED]: { label: 'Created', muiColor: 'info' },
  [SHIPMENT_STATUS.READY_TO_SHIP]: { label: 'Ready to ship', muiColor: 'info' },
  [SHIPMENT_STATUS.SHIPPED]: { label: 'Shipped', muiColor: 'success' },
  [SHIPMENT_STATUS.IN_TRANSIT]: { label: 'In transit', muiColor: 'info' },
  [SHIPMENT_STATUS.DELIVERED]: { label: 'Delivered', muiColor: 'success' },
  [SHIPMENT_STATUS.FAILED]: { label: 'Failed', muiColor: 'error' },
  [SHIPMENT_STATUS.CANCELLED]: { label: 'Cancelled', muiColor: 'default' },
};

export function getShipmentStatusPresentation(status) {
  return shipmentStatusPresentation[status] ?? { label: status, muiColor: 'default' };
}
