import Chip from '@mui/material/Chip';
import { getProductStatusPresentation } from '../../constants/productStatusPresentation.js';
import { getStockLocationStatusPresentation } from '../../constants/stockLocationStatusPresentation.js';

/**
 * @param {{ status: string, domain?: 'product' | 'stockLocation' }} props
 */
export function StatusBadge({ status, domain = 'product' }) {
  const presentation =
    domain === 'stockLocation'
      ? getStockLocationStatusPresentation(status)
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
