import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { useCallback, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PageHeader } from '../../components/common/PageHeader.jsx';
import { StatusBadge } from '../../components/common/StatusBadge.jsx';
import { CreateStockLocationDialog } from '../../components/inventory/CreateStockLocationDialog.jsx';
import { InventoryBalancesTable } from '../../components/inventory/InventoryBalancesTable.jsx';
import { InventoryFilters } from '../../components/inventory/InventoryFilters.jsx';
import { InventoryOperationDialog } from '../../components/inventory/InventoryOperationDialog.jsx';
import { EmptyState } from '../../components/ui/EmptyState.jsx';
import { ErrorState } from '../../components/ui/ErrorState.jsx';
import {
  useAdjustInventory,
  useCreateStockLocation,
  useReceiveInventory,
  useReleaseInventory,
  useReserveInventory,
} from '../../hooks/inventory/useInventoryMutations.js';
import { useInventoryBalances, useStockLocations } from '../../hooks/inventory/useInventoryQueries.js';
import { useNotification } from '../../hooks/useNotification.js';
import { confirmAction } from '../../utils/confirmDialog.js';

export function InventoryPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const stockLocationId = searchParams.get('stockLocationId') ?? '';
  const [locationDialogOpen, setLocationDialogOpen] = useState(false);
  const [operationState, setOperationState] = useState(
    /** @type {{ operation: 'adjust'|'receive'|'reserve'|'release', balance: import('../../services/api/inventoryService.js').InventoryBalance } | null} */ (null),
  );

  const locationsQuery = useStockLocations();
  const balancesQuery = useInventoryBalances({
    ...(stockLocationId ? { stockLocationId } : {}),
  });

  const createLocationMutation = useCreateStockLocation();
  const adjustMutation = useAdjustInventory();
  const receiveMutation = useReceiveInventory();
  const reserveMutation = useReserveInventory();
  const releaseMutation = useReleaseInventory();
  const { notify } = useNotification();

  const locationsById = useMemo(() => {
    const list = locationsQuery.data ?? [];
    return Object.fromEntries(list.map((location) => [location.id, location]));
  }, [locationsQuery.data]);
  const locations = locationsQuery.data ?? [];
  const balances = balancesQuery.data ?? [];

  const setLocationFilter = useCallback(
    (value) => {
      const params = new URLSearchParams();
      if (value) params.set('stockLocationId', value);
      setSearchParams(params);
    },
    [setSearchParams],
  );

  const isMutationPending =
    adjustMutation.isPending ||
    receiveMutation.isPending ||
    reserveMutation.isPending ||
    releaseMutation.isPending;

  const handleOperationSubmit = async (payload) => {
    const operation = operationState?.operation;
    if (!operation) return;

    if (operation === 'adjust' || operation === 'receive') {
      const result = await confirmAction({
        title: operation === 'adjust' ? 'Confirm adjustment?' : 'Confirm receipt?',
        text: 'This updates inventory quantities for the selected product and location.',
        confirmButtonText: 'Continue',
      });
      if (!result.isConfirmed) return;
    }

    if (operation === 'adjust') {
      await adjustMutation.mutateAsync(payload);
      notify('Inventory adjusted.', 'success');
    } else if (operation === 'receive') {
      await receiveMutation.mutateAsync(payload);
      notify('Inventory received.', 'success');
    } else if (operation === 'reserve') {
      await reserveMutation.mutateAsync(payload);
      notify('Inventory reserved.', 'success');
    } else if (operation === 'release') {
      await releaseMutation.mutateAsync(payload);
      notify('Reservation released.', 'success');
    }
  };

  const hasLocationFilter = Boolean(stockLocationId);
  const balancesEmptyTitle = hasLocationFilter
    ? 'No balances for this location'
    : 'No inventory balances yet';
  const balancesEmptyDescription = hasLocationFilter
    ? 'Try another stock location or receive stock into this location.'
    : 'Receive or adjust inventory once products and locations exist.';

  return (
    <>
      <PageHeader
        title="Inventory"
        description="Stock locations and quantity balances from the tenant inventory API."
        action={
          <Button variant="outlined" size="small" startIcon={<AddIcon />} onClick={() => setLocationDialogOpen(true)}>
            New location
          </Button>
        }
      />

      <Typography variant="h3" component="h2" sx={{ mb: 1 }}>
        Stock locations
      </Typography>
      {locationsQuery.isError ? (
        <ErrorState error={locationsQuery.error} onRetry={() => locationsQuery.refetch()} />
      ) : (
        <TableContainer component={Paper} sx={{ mb: 4 }} className="overflow-x-auto">
          <Table size="small" aria-label="Stock locations">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>External reference</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Updated</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {locations.length === 0 && !locationsQuery.isLoading ? (
                <TableRow>
                  <TableCell colSpan={4}>
                    <EmptyState
                      title="No stock locations"
                      description="Create a stock location to track inventory by warehouse or channel node."
                      action={
                        <Button size="small" variant="contained" onClick={() => setLocationDialogOpen(true)}>
                          Create location
                        </Button>
                      }
                    />
                  </TableCell>
                </TableRow>
              ) : (
                locations.map((location) => (
                  <TableRow key={location.id} hover>
                    <TableCell>{location.name}</TableCell>
                    <TableCell>{location.externalReference ?? '—'}</TableCell>
                    <TableCell>
                      <StatusBadge status={location.status} domain="stockLocation" />
                    </TableCell>
                    <TableCell>{new Date(location.updatedAt).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Typography variant="h3" component="h2" sx={{ mb: 1 }}>
        Balances
      </Typography>
      <InventoryFilters
        stockLocationId={stockLocationId}
        onStockLocationChange={setLocationFilter}
        locations={locations}
        locationsLoading={locationsQuery.isLoading}
      />

      {balancesQuery.isError ? (
        <ErrorState error={balancesQuery.error} onRetry={() => balancesQuery.refetch()} />
      ) : null}

      {!balancesQuery.isError && !balancesQuery.isLoading && balances.length === 0 ? (
        <EmptyState title={balancesEmptyTitle} description={balancesEmptyDescription} />
      ) : null}

      {!balancesQuery.isError && (balancesQuery.isLoading || balances.length > 0) ? (
        <InventoryBalancesTable
          balances={balances}
          locationsById={locationsById}
          isLoading={balancesQuery.isLoading}
          onOperation={(operation, balance) =>
            setOperationState({ operation, balance })
          }
        />
      ) : null}

      <CreateStockLocationDialog
        open={locationDialogOpen}
        isSubmitting={createLocationMutation.isPending}
        onClose={() => setLocationDialogOpen(false)}
        onSubmit={async (body) => {
          await createLocationMutation.mutateAsync(body);
          notify('Stock location created.', 'success');
        }}
      />

      <InventoryOperationDialog
        open={Boolean(operationState)}
        operation={operationState?.operation ?? null}
        balance={operationState?.balance ?? null}
        locationName={
          operationState?.balance
            ? locationsById[operationState.balance.stockLocationId]?.name
            : undefined
        }
        isSubmitting={isMutationPending}
        onClose={() => setOperationState(null)}
        onSubmit={handleOperationSubmit}
      />
    </>
  );
}
