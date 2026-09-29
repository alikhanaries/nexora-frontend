import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/common/PageHeader.jsx';
import { ApiKeySecretDialog } from '../../components/api-keys/ApiKeySecretDialog.jsx';
import { WebhookForm } from '../../components/webhooks/WebhookForm.jsx';
import { useCreateWebhook } from '../../hooks/webhooks/useWebhookMutations.js';

export function WebhookCreatePage() {
  const navigate = useNavigate();
  const createMutation = useCreateWebhook();
  const [secretDialog, setSecretDialog] = useState(
    /** @type {{ open: boolean, secret: string, title: string, helperText?: string }} */ ({
      open: false,
      secret: '',
      title: '',
    }),
  );
  const [createdWebhookId, setCreatedWebhookId] = useState('');

  const closeSecretDialog = () => {
    setSecretDialog({ open: false, secret: '', title: '' });
    navigate(createdWebhookId ? `/webhooks/${createdWebhookId}` : '/webhooks');
  };

  return (
    <>
      <PageHeader
        title="Create webhook"
        description="Subscribe an HTTPS endpoint to Nexora integration events. The signing secret is shown only once."
      />
      <WebhookForm
        mode="create"
        isSubmitting={createMutation.isPending}
        onCancel={() => navigate('/webhooks')}
        onSubmit={async (values) => {
          const created = await createMutation.mutateAsync(values);
          setCreatedWebhookId(created.id);
          setSecretDialog({
            open: true,
            secret: created.secret,
            title: 'Webhook signing secret',
            helperText: created.url,
          });
        }}
      />
      <ApiKeySecretDialog
        open={secretDialog.open}
        title={secretDialog.title}
        secret={secretDialog.secret}
        helperText={secretDialog.helperText}
        secretFieldLabel="Signing secret"
        onClose={closeSecretDialog}
      />
    </>
  );
}
