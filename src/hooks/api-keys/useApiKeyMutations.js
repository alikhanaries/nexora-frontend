import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiKeyQueryKeys } from '../../constants/apiKeyQueryKeys.js';
import { apiKeysService } from '../../services/api/apiKeysService.js';

export function useCreateApiKey() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body) => apiKeysService.createApiKey(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: apiKeyQueryKeys.lists() });
    },
  });
}

export function useRotateApiKey() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (apiKeyId) => apiKeysService.rotateApiKey(apiKeyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: apiKeyQueryKeys.lists() });
    },
  });
}

export function useRevokeApiKey() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (apiKeyId) => apiKeysService.revokeApiKey(apiKeyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: apiKeyQueryKeys.lists() });
    },
  });
}
