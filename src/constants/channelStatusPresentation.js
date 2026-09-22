import { CHANNEL_STATUS } from './channelCatalog.js';

/** @type {Record<string, { label: string, muiColor: 'success' | 'default' | 'warning' }>} */
export const channelStatusPresentation = {
  [CHANNEL_STATUS.ACTIVE]: { label: 'Active', muiColor: 'success' },
  [CHANNEL_STATUS.INACTIVE]: { label: 'Inactive', muiColor: 'default' },
  [CHANNEL_STATUS.SUSPENDED]: { label: 'Suspended', muiColor: 'warning' },
};

export function getChannelStatusPresentation(status) {
  return channelStatusPresentation[status] ?? { label: status, muiColor: 'default' };
}
