import { useQuery } from '@tanstack/react-query';
import { auditQueryKeys } from '../../constants/auditQueryKeys.js';
import { auditService } from '../../services/api/auditService.js';

/**
 * @param {{ eventType?: string, limit?: number, offset?: number }} filters
 */
export function useAuditEvents(filters) {
  const queryFilters = {
    ...(filters.limit !== undefined ? { limit: filters.limit } : {}),
    ...(filters.offset !== undefined ? { offset: filters.offset } : {}),
    ...(filters.eventType ? { eventType: filters.eventType } : {}),
  };

  return useQuery({
    queryKey: auditQueryKeys.list(queryFilters),
    queryFn: () => auditService.listAuditEvents(queryFilters),
    staleTime: 30_000,
  });
}
