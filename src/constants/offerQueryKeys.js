export const offerQueryKeys = {
  all: ['offers'],
  lists: () => [...offerQueryKeys.all, 'list'],
  list: (filters) => [...offerQueryKeys.lists(), filters],
  details: () => [...offerQueryKeys.all, 'detail'],
  detail: (offerId) => [...offerQueryKeys.details(), offerId],
};
