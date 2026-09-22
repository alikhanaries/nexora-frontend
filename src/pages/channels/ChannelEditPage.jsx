import { useNavigate, useParams } from 'react-router-dom';
import { PageHeader } from '../../components/common/PageHeader.jsx';
import { ChannelForm } from '../../components/channels/ChannelForm.jsx';
import { useUpdateChannel } from '../../hooks/channels/useChannelMutations.js';
import { useChannel } from '../../hooks/channels/useChannelQueries.js';
import { useMarketplaces } from '../../hooks/marketplaces/useMarketplaceQueries.js';
import { useNotification } from '../../hooks/useNotification.js';
import { ErrorState } from '../../components/ui/ErrorState.jsx';
import { LoadingScreen } from '../../components/ui/LoadingScreen.jsx';
import { formatMarketplaceLabel } from '../../utils/marketplaceLabel.js';

export function ChannelEditPage() {
  const { channelId } = useParams();
  const navigate = useNavigate();
  const { data: channel, isLoading, isError, error, refetch } = useChannel(channelId);
  const { data: marketplaces } = useMarketplaces();
  const updateMutation = useUpdateChannel(channelId);
  const { notify } = useNotification();

  if (isLoading) {
    return <LoadingScreen message="Loading channel…" />;
  }

  if (isError) {
    return (
      <ErrorState
        error={error}
        title={error?.httpStatus === 404 ? 'Channel not found' : 'Unable to load channel'}
        onRetry={() => refetch()}
      />
    );
  }

  if (!channel) {
    return null;
  }

  return (
    <>
      <PageHeader title="Edit channel" description={channel.name} />
      <ChannelForm
        mode="edit"
        initialValues={{
          marketplaceId: channel.marketplaceId,
          marketplaceLabel: formatMarketplaceLabel(marketplaces, channel.marketplaceId),
          name: channel.name,
          externalReference: channel.externalReference ?? '',
          configurationReference: channel.configurationReference ?? '',
        }}
        isSubmitting={updateMutation.isPending}
        onCancel={() => navigate(`/channels/${channel.id}`)}
        onSubmit={async (values) => {
          await updateMutation.mutateAsync(values);
          notify('Channel updated.', 'success');
          navigate(`/channels/${channel.id}`);
        }}
      />
    </>
  );
}
