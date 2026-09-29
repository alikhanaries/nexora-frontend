import Button from '@mui/material/Button';
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { PageHeader } from '../../components/common/PageHeader.jsx';
import { ApiKeySecretDialog } from '../../components/api-keys/ApiKeySecretDialog.jsx';
import { ApiKeysTable } from '../../components/api-keys/ApiKeysTable.jsx';
import { EmptyState } from '../../components/ui/EmptyState.jsx';
import { ErrorState } from '../../components/ui/ErrorState.jsx';
import { useRotateApiKey, useRevokeApiKey } from '../../hooks/api-keys/useApiKeyMutations.js';
import { useApiKeys } from '../../hooks/api-keys/useApiKeyQueries.js';
import { useNotification } from '../../hooks/useNotification.js';
import { getUserFacingMessage } from '../../services/api/apiError.js';
import { confirmAction } from '../../utils/confirmDialog.js';

export function ApiKeysListPage() {
  const { data: apiKeys, isLoading, isError, error, refetch } = useApiKeys();
  const rotateMutation = useRotateApiKey();
  const revokeMutation = useRevokeApiKey();
  const { notify } = useNotification();

  const [secretDialog, setSecretDialog] = useState(
    /** @type {{ open: boolean, secret: string, title: string, helperText?: string }} */ ({
      open: false,
      secret: '',
      title: '',
    }),
  );

  const closeSecretDialog = () => {
    setSecretDialog({ open: false, secret: '', title: '' });
  };

  const list = apiKeys ?? [];
  const actionsDisabled = rotateMutation.isPending || revokeMutation.isPending;

  const handleRotate = async (apiKey) => {
    const result = await confirmAction({
      title: 'Rotate API key?',
      text: `${apiKey.name} (${apiKey.prefix}…) will be replaced. The previous key stops working after rotation.`,
      confirmButtonText: 'Rotate',
    });
    if (!result.isConfirmed) return;
    try {
      const rotated = await rotateMutation.mutateAsync(apiKey.id);
      setSecretDialog({
        open: true,
        secret: rotated.secret,
        title: 'New API key secret',
        helperText: `New key prefix: ${rotated.prefix}. Previous key ID: ${rotated.rotatedFromId}`,
      });
      notify('API key rotated.', 'success');
    } catch (mutationError) {
      notify(getUserFacingMessage(mutationError), 'error');
    }
  };

  const handleRevoke = async (apiKey) => {
    const result = await confirmAction({
      title: 'Revoke API key?',
      text: `${apiKey.name} will stop working immediately. This cannot be undone.`,
      confirmButtonText: 'Revoke',
    });
    if (!result.isConfirmed) return;
    try {
      await revokeMutation.mutateAsync(apiKey.id);
      notify('API key revoked.', 'success');
    } catch (mutationError) {
      notify(getUserFacingMessage(mutationError), 'error');
    }
  };

  return (
    <>
      <PageHeader
        title="API keys"
        description="Manage credentials used by applications and integrations to access Nexora APIs."
        action={
          <Button component={RouterLink} to="/api-keys/new" variant="contained" size="small">
            Create API key
          </Button>
        }
      />
      {isError ? (
        <ErrorState
          error={error}
          title={error?.httpStatus === 403 ? 'Access denied' : 'Unable to load API keys'}
          onRetry={() => refetch()}
        />
      ) : null}
      {!isError && !isLoading && list.length === 0 ? (
        <EmptyState
          title="No API keys yet"
          description="Create an API key to authenticate automated clients against your tenant."
          action={
            <Button component={RouterLink} to="/api-keys/new" variant="contained" size="small">
              Create API key
            </Button>
          }
        />
      ) : null}
      {!isError && (isLoading || list.length > 0) ? (
        <ApiKeysTable
          apiKeys={list}
          isLoading={isLoading}
          onRotate={handleRotate}
          onRevoke={handleRevoke}
          actionsDisabled={actionsDisabled}
        />
      ) : null}
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
