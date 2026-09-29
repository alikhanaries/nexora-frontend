import { useMutation, useQueryClient } from '@tanstack/react-query';
import { webhookQueryKeys } from '../../constants/webhookQueryKeys.js';
import { webhooksService } from '../../services/api/webhooksService.js';

export function useCreateWebhook() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body) => webhooksService.createWebhook(body),
    onSuccess: (created) => {
      const subscription = { ...created };
      delete subscription.secret;
      queryClient.setQueryData(webhookQueryKeys.detail(subscription.id), subscription);
      queryClient.invalidateQueries({ queryKey: webhookQueryKeys.lists() });
    },
  });
}

export function useUpdateWebhook(webhookId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body) => webhooksService.updateWebhook(webhookId, body),
    onSuccess: (subscription) => {
      queryClient.setQueryData(webhookQueryKeys.detail(subscription.id), subscription);
      queryClient.invalidateQueries({ queryKey: webhookQueryKeys.lists() });
    },
  });
}

export function useDeleteWebhook() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (webhookId) => webhooksService.deleteWebhook(webhookId),
    onSuccess: (_data, webhookId) => {
      queryClient.removeQueries({ queryKey: webhookQueryKeys.detail(webhookId) });
      queryClient.invalidateQueries({ queryKey: webhookQueryKeys.lists() });
    },
  });
}

export function useRotateWebhookSecret() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (webhookId) => webhooksService.rotateWebhookSecret(webhookId),
    onSuccess: (result) => {
      queryClient.setQueryData(webhookQueryKeys.detail(result.subscription.id), result.subscription);
      queryClient.invalidateQueries({ queryKey: webhookQueryKeys.lists() });
    },
  });
}
