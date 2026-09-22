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
import { ChannelsRoutes } from './ChannelsRoutes.jsx';
import { MarketplacesRoutes } from './MarketplacesRoutes.jsx';
import { PricingRoutes } from './PricingRoutes.jsx';
import { ProductsRoutes } from './ProductsRoutes.jsx';
import { ProtectedRoute } from './ProtectedRoute.jsx';

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
          <Route path="products/*" element={<ProductsRoutes />} />
          <Route path="inventory/*" element={<InventoryRoutes />} />
          <Route path="pricing/*" element={<PricingRoutes />} />
          <Route path="offers/*" element={<OffersRoutes />} />
          <Route path="orders/*" element={<OrdersRoutes />} />
          <Route path="shipments/*" element={<ShipmentsRoutes />} />
          <Route path="marketplaces/*" element={<MarketplacesRoutes />} />
          <Route path="channels/*" element={<ChannelsRoutes />} />
          {navigationConfig
            .filter(
              (item) =>
                ![
                  'products',
                  'inventory',
                  'pricing',
                  'offers',
                  'orders',
                  'shipments',
                  'marketplaces',
                  'channels',
                ].includes(item.id),
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
