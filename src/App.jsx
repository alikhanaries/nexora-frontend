import { AppProviders } from './providers/AppProviders.jsx';
import { AppRoutes } from './routes/AppRoutes.jsx';

export function App() {
  return (
    <AppProviders>
      <AppRoutes />
    </AppProviders>
  );
}
