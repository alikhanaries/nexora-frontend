/**
 * @param {import('../services/api/channelsService.js').Channel[] | undefined} channels
 * @param {string} channelId
 * @returns {string}
 */
export function formatChannelLabel(channels, channelId) {
  if (!channelId) return '—';
  const match = channels?.find((channel) => channel.id === channelId);
  if (match) return `${match.name} (${channelId})`;
  return channelId;
}

/**
 * @param {import('../services/api/channelsService.js').Channel[] | undefined} channels
 * @returns {Record<string, string>}
 */
export function buildChannelNameById(channels) {
  if (!channels?.length) return {};
  return Object.fromEntries(channels.map((channel) => [channel.id, channel.name]));
}
