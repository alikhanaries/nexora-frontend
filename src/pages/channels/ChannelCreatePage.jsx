import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/common/PageHeader.jsx';
import { ChannelForm } from '../../components/channels/ChannelForm.jsx';
import { useCreateChannel } from '../../hooks/channels/useChannelMutations.js';
import { useNotification } from '../../hooks/useNotification.js';

export function ChannelCreatePage() {
  const navigate = useNavigate();
  const createMutation = useCreateChannel();
  const { notify } = useNotification();

  return (
    <>
      <PageHeader title="New channel" description="Connect a marketplace as a tenant sales channel." />
      <ChannelForm
        mode="create"
        isSubmitting={createMutation.isPending}
        onCancel={() => navigate('/channels')}
        onSubmit={async (values) => {
          const channel = await createMutation.mutateAsync(values);
          notify('Channel created.', 'success');
          navigate(`/channels/${channel.id}`);
        }}
      />
    </>
  );
}
