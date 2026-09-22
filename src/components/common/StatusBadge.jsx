import Chip from '@mui/material/Chip';
import { getListingStatusPresentation } from '../../constants/listingStatusPresentation.js';
import { getOfferStatusPresentation } from '../../constants/offerStatusPresentation.js';
import { getOrderStatusPresentation } from '../../constants/orderStatusPresentation.js';
import { getReturnStatusPresentation } from '../../constants/returnStatusPresentation.js';
import { getShipmentStatusPresentation } from '../../constants/shipmentStatusPresentation.js';
import { getPriceStatusPresentation } from '../../constants/priceStatusPresentation.js';
import { getProductStatusPresentation } from '../../constants/productStatusPresentation.js';
import { getStockLocationStatusPresentation } from '../../constants/stockLocationStatusPresentation.js';
import { getChannelStatusPresentation } from '../../constants/channelStatusPresentation.js';

/**
 * @param {{ status: string, domain?: 'product' | 'stockLocation' | 'pricing' | 'offer' | 'listing' | 'order' | 'shipment' | 'return' | 'channel' }} props
 */
export function StatusBadge({ status, domain = 'product' }) {
  const presentation =
    domain === 'stockLocation'
      ? getStockLocationStatusPresentation(status)
      : domain === 'pricing'
        ? getPriceStatusPresentation(status)
        : domain === 'return'
          ? getReturnStatusPresentation(status)
          : domain === 'shipment'
            ? getShipmentStatusPresentation(status)
            : domain === 'order'
            ? getOrderStatusPresentation(status)
            : domain === 'offer'
              ? getOfferStatusPresentation(status)
              : domain === 'listing'
                ? getListingStatusPresentation(status)
                : domain === 'channel'
                  ? getChannelStatusPresentation(status)
                  : domain === 'product'
                    ? getProductStatusPresentation(status)
                    : { label: status, muiColor: 'default' };
  return (
    <Chip
      size="small"
      label={presentation.label}
      color={presentation.muiColor}
      variant="outlined"
      aria-label={`Status: ${presentation.label}`}
    />
  );
}
