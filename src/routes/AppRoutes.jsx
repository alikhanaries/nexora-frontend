import { Navigate, Route, Routes } from 'react-router-dom';
import { navigationConfig } from '../constants/navigationConfig.js';
import { AppLayout } from '../layouts/AppLayout.jsx';
import { AuthLayout } from '../layouts/AuthLayout.jsx';
import { LoginPage } from '../pages/auth/LoginPage.jsx';
import { ModulePlaceholderPage } from '../pages/ModulePlaceholderPage.jsx';
import { OverviewPage } from '../pages/overview/OverviewPage.jsx';
import { GuestRoute } from './GuestRoute.jsx';
import { InventoryRoutes } from './InventoryRoutes.jsx';
import { OffersRoutes } from './OffersRoutes.jsx';
import { OrdersRoutes } from './OrdersRoutes.jsx';
import { ReturnsRoutes } from './ReturnsRoutes.jsx';
import { ShipmentsRoutes } from './ShipmentsRoutes.jsx';
import { CancellationsRoutes } from './CancellationsRoutes.jsx';
import { ChannelsRoutes } from './ChannelsRoutes.jsx';
import { MarketplacesRoutes } from './MarketplacesRoutes.jsx';
import { ApiKeysRoutes } from './ApiKeysRoutes.jsx';
import { AuditRoutes } from './AuditRoutes.jsx';
import { PricingRoutes } from './PricingRoutes.jsx';
import { SettingsRoutes } from './SettingsRoutes.jsx';
import { WebhooksRoutes } from './WebhooksRoutes.jsx';
import { ProductsRoutes } from './ProductsRoutes.jsx';
import { PERMISSIONS } from '../constants/permissions.js';
import { ProtectedRoute } from './ProtectedRoute.jsx';
import { RequirePermission } from './RequirePermission.jsx';
import { SettingsRoutes } from './SettingsRoutes.jsx';

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<GuestRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route index element={<OverviewPage />} />
          <Route element={<RequirePermission permission={PERMISSIONS.MARKETPLACES_READ} />}>
            <Route path="marketplaces/*" element={<MarketplacesRoutes />} />
          </Route>
          <Route element={<RequirePermission permission={PERMISSIONS.PRODUCTS_READ} />}>
            <Route path="products/*" element={<ProductsRoutes />} />
          </Route>
          <Route element={<RequirePermission permission={PERMISSIONS.INVENTORY_READ} />}>
            <Route path="inventory/*" element={<InventoryRoutes />} />
          </Route>
          <Route element={<RequirePermission permission={PERMISSIONS.PRICING_READ} />}>
            <Route path="pricing/*" element={<PricingRoutes />} />
          </Route>
          <Route element={<RequirePermission permission={PERMISSIONS.OFFERS_READ} />}>
            <Route path="offers/*" element={<OffersRoutes />} />
          </Route>
          <Route element={<RequirePermission permission={PERMISSIONS.ORDERS_READ} />}>
            <Route path="orders/*" element={<OrdersRoutes />} />
          </Route>
          <Route element={<RequirePermission permission={PERMISSIONS.SHIPMENTS_READ} />}>
            <Route path="shipments/*" element={<ShipmentsRoutes />} />
          </Route>
          <Route element={<RequirePermission permission={PERMISSIONS.RETURNS_READ} />}>
            <Route path="returns/*" element={<ReturnsRoutes />} />
          </Route>
          <Route element={<RequirePermission permission={PERMISSIONS.CANCELLATIONS_READ} />}>
            <Route path="cancellations/*" element={<CancellationsRoutes />} />
          </Route>
          <Route element={<RequirePermission permission={PERMISSIONS.RETURNS_READ} />}>
            <Route path="returns/*" element={<ReturnsRoutes />} />
          </Route>
          <Route element={<RequirePermission permission={PERMISSIONS.CHANNELS_READ} />}>
            <Route path="channels/*" element={<ChannelsRoutes />} />
          </Route>
          <Route path="settings/*" element={<SettingsRoutes />} />
          {navigationConfig
            .filter(
              (item) =>
                ![
                  'overview',
                  'products',
                  'inventory',
                  'pricing',
                  'offers',
                  'orders',
                  'shipments',
                  'cancellations',
                  'returns',
                  'channels',
                  'settings',
                ].includes(item.id),
            )
            .map((item) => (
              <Route
                key={item.id}
                path={item.path.replace(/^\//, '')}
                element={<ModulePlaceholderPage />}
              />
            ))}
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
