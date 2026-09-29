import { useNavigate, useParams } from 'react-router-dom';
import { PageHeader } from '../../components/common/PageHeader.jsx';
import { WebhookForm } from '../../components/webhooks/WebhookForm.jsx';
import { useUpdateWebhook } from '../../hooks/webhooks/useWebhookMutations.js';
import { useWebhook } from '../../hooks/webhooks/useWebhookQueries.js';
import { useNotification } from '../../hooks/useNotification.js';
import { ErrorState } from '../../components/ui/ErrorState.jsx';
import { LoadingScreen } from '../../components/ui/LoadingScreen.jsx';
import { WEBHOOK_SUBSCRIPTION_STATUS } from '../../constants/webhookCatalog.js';

export function WebhookEditPage() {
  const { webhookId } = useParams();
  const navigate = useNavigate();
  const { data: webhook, isLoading, isError, error, refetch } = useWebhook(webhookId);
  const updateMutation = useUpdateWebhook(webhookId);
  const { notify } = useNotification();

  if (isLoading) {
    return <LoadingScreen message="Loading webhook…" />;
  }

  if (isError) {
    return (
      <ErrorState
        error={error}
        title={error?.httpStatus === 404 ? 'Webhook not found' : 'Unable to load webhook'}
        onRetry={() => refetch()}
      />
    );
  }

  if (!webhook || webhook.status === WEBHOOK_SUBSCRIPTION_STATUS.DELETED) {
    return null;
  }

  return (
    <>
      <PageHeader title="Edit webhook" description={webhook.url} />
      <WebhookForm
        mode="edit"
        initialValues={{
          url: webhook.url,
          description: webhook.description ?? '',
          eventTypes: webhook.eventTypes,
          status: webhook.status,
        }}
        isSubmitting={updateMutation.isPending}
        onCancel={() => navigate(`/webhooks/${webhook.id}`)}
        onSubmit={async (values) => {
          await updateMutation.mutateAsync(values);
          notify('Webhook updated.', 'success');
          navigate(`/webhooks/${webhook.id}`);
        }}
      />
    </>
  );
}
