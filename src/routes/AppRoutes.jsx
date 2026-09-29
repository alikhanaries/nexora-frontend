import { Navigate, Route, Routes } from 'react-router-dom';
import { navigationConfig } from '../constants/navigationConfig.js';
import { AppLayout } from '../layouts/AppLayout.jsx';
import { AuthLayout } from '../layouts/AuthLayout.jsx';
import { LoginPage } from '../pages/auth/LoginPage.jsx';
import { ModulePlaceholderPage } from '../pages/ModulePlaceholderPage.jsx';
import { GuestRoute } from './GuestRoute.jsx';
import { InventoryRoutes } from './InventoryRoutes.jsx';
import { OffersRoutes } from './OffersRoutes.jsx';
import { OrdersRoutes } from './OrdersRoutes.jsx';
import { ShipmentsRoutes } from './ShipmentsRoutes.jsx';
import { CancellationsRoutes } from './CancellationsRoutes.jsx';
import { ChannelsRoutes } from './ChannelsRoutes.jsx';
import { AuditRoutes } from './AuditRoutes.jsx';
import { PricingRoutes } from './PricingRoutes.jsx';
import { ProductsRoutes } from './ProductsRoutes.jsx';
import { PERMISSIONS } from '../constants/permissions.js';
import { ProtectedRoute } from './ProtectedRoute.jsx';
import { RequirePermission } from './RequirePermission.jsx';

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
          <Route element={<RequirePermission permission={PERMISSIONS.CANCELLATIONS_READ} />}>
            <Route path="cancellations/*" element={<CancellationsRoutes />} />
          </Route>
          <Route element={<RequirePermission permission={PERMISSIONS.CHANNELS_READ} />}>
            <Route path="channels/*" element={<ChannelsRoutes />} />
          </Route>
          {navigationConfig
            .filter(
              (item) =>
                !['products', 'inventory', 'pricing', 'offers', 'orders', 'shipments', 'cancellations', 'channels'].includes(
                  item.id,
                ),
            )
            .map((item) =>
              item.path === '/' ? (
                <Route key={item.id} index element={<ModulePlaceholderPage />} />
              ) : (
                <Route
                  key={item.id}
                  path={item.path.replace(/^\//, '')}
                  element={<ModulePlaceholderPage />}
                />
              ),
            )}
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
