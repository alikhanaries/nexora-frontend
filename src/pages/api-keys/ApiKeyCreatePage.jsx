import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/common/PageHeader.jsx';
import { ApiKeyForm } from '../../components/api-keys/ApiKeyForm.jsx';
import { ApiKeySecretDialog } from '../../components/api-keys/ApiKeySecretDialog.jsx';
import { useCreateApiKey } from '../../hooks/api-keys/useApiKeyMutations.js';

export function ApiKeyCreatePage() {
  const navigate = useNavigate();
  const createMutation = useCreateApiKey();
  const [secretDialog, setSecretDialog] = useState(
    /** @type {{ open: boolean, secret: string, title: string, helperText?: string }} */ ({
      open: false,
      secret: '',
      title: '',
    }),
  );

  const closeSecretDialog = () => {
    setSecretDialog({ open: false, secret: '', title: '' });
    navigate('/api-keys');
  };

  return (
    <>
      <PageHeader
        title="Create API key"
        description="Define scopes and generate a tenant credential. The secret is shown only once."
      />
      <ApiKeyForm
        isSubmitting={createMutation.isPending}
        onCancel={() => navigate('/api-keys')}
        onSubmit={async (values) => {
          const created = await createMutation.mutateAsync(values);
          setSecretDialog({
            open: true,
            secret: created.secret,
            title: 'API key created',
            helperText: `${created.name} · prefix ${created.prefix}`,
          });
        }}
      />
      <ApiKeySecretDialog
        open={secretDialog.open}
        title={secretDialog.title}
        secret={secretDialog.secret}
        helperText={secretDialog.helperText}
        onClose={closeSecretDialog}
      />
    </>
  );
}
