import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { LoadingScreen } from '../components/ui/LoadingScreen.jsx';

const WebhooksListPage = lazy(() =>
  import('../pages/webhooks/WebhooksListPage.jsx').then((m) => ({ default: m.WebhooksListPage })),
);
const WebhookCreatePage = lazy(() =>
  import('../pages/webhooks/WebhookCreatePage.jsx').then((m) => ({ default: m.WebhookCreatePage })),
);
const WebhookDetailPage = lazy(() =>
  import('../pages/webhooks/WebhookDetailPage.jsx').then((m) => ({ default: m.WebhookDetailPage })),
);
const WebhookEditPage = lazy(() =>
  import('../pages/webhooks/WebhookEditPage.jsx').then((m) => ({ default: m.WebhookEditPage })),
);

function LazyPage({ children }) {
  return <Suspense fallback={<LoadingScreen message="Loading page…" />}>{children}</Suspense>;
}

export function WebhooksRoutes() {
  return (
    <Routes>
      <Route
        index
        element={
          <LazyPage>
            <WebhooksListPage />
          </LazyPage>
        }
      />
      <Route
        path="new"
        element={
          <LazyPage>
            <WebhookCreatePage />
          </LazyPage>
        }
      />
      <Route
        path=":webhookId/edit"
        element={
          <LazyPage>
            <WebhookEditPage />
          </LazyPage>
        }
      />
      <Route
        path=":webhookId"
        element={
          <LazyPage>
            <WebhookDetailPage />
          </LazyPage>
        }
      />
    </Routes>
  );
}
