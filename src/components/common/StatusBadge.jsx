import Chip from '@mui/material/Chip';
import { getProductStatusPresentation } from '../../constants/productStatusPresentation.js';

/**
 * Product status chip — extend for other domains in later phases.
 * @param {{ status: string, domain?: 'product' }} props
 */
export function StatusBadge({ status, domain = 'product' }) {
  if (domain !== 'product') {
    return <Chip size="small" label={status} variant="outlined" />;
  }

  const presentation = getProductStatusPresentation(status);
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
