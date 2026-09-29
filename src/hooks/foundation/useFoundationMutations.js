import { useMutation } from '@tanstack/react-query';
import { foundationService } from '../../services/api/foundationService.js';

export function useFoundationPing() {
  return useMutation({
    mutationFn: () => foundationService.ping(),
  });
}

export function useFoundationEcho() {
  return useMutation({
    mutationFn: (body) => foundationService.echo(body),
  });
}
