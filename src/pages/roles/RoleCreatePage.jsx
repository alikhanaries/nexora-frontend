import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/common/PageHeader.jsx';
import { RoleForm } from '../../components/roles/RoleForm.jsx';
import { useCreateRole } from '../../hooks/roles/useRoleMutations.js';
import { useNotification } from '../../hooks/useNotification.js';

export function RoleCreatePage() {
  const navigate = useNavigate();
  const createMutation = useCreateRole();
  const { notify } = useNotification();

  return (
    <>
      <PageHeader
        title="Create role"
        description="Custom roles bundle permission keys for membership assignment."
      />
      <RoleForm
        isSubmitting={createMutation.isPending}
        onCancel={() => navigate('/roles')}
        onSubmit={async (values) => {
          await createMutation.mutateAsync(values);
          notify('Role created.', 'success');
          navigate('/roles');
        }}
      />
    </>
  );
}
