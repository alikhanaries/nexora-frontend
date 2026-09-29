import { useQuery } from '@tanstack/react-query';
import { apiKeyQueryKeys } from '../../constants/apiKeyQueryKeys.js';
import { apiKeysService } from '../../services/api/apiKeysService.js';

export function useApiKeys() {
  return useQuery({
    queryKey: apiKeyQueryKeys.list(),
    queryFn: () => apiKeysService.listApiKeys(),
    staleTime: 30_000,
  });
}
