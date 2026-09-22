import { useMutation, useQueryClient } from '@tanstack/react-query';
import { channelQueryKeys } from '../../constants/channelQueryKeys.js';
import { channelsService } from '../../services/api/channelsService.js';

export function useCreateChannel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body) => channelsService.createChannel(body),
    onSuccess: (channel) => {
      queryClient.setQueryData(channelQueryKeys.detail(channel.id), channel);
      queryClient.invalidateQueries({ queryKey: channelQueryKeys.lists() });
    },
  });
}

export function useUpdateChannel(channelId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body) => channelsService.updateChannel(channelId, body),
    onSuccess: (channel) => {
      queryClient.setQueryData(channelQueryKeys.detail(channel.id), channel);
      queryClient.invalidateQueries({ queryKey: channelQueryKeys.lists() });
    },
  });
}
