export const apiKeyQueryKeys = {
  all: ['api-keys'],
  lists: () => [...apiKeyQueryKeys.all, 'list'],
  list: () => [...apiKeyQueryKeys.lists()],
};
