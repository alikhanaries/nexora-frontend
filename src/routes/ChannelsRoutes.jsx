import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { LoadingScreen } from '../components/ui/LoadingScreen.jsx';

const ChannelsListPage = lazy(() =>
  import('../pages/channels/ChannelsListPage.jsx').then((m) => ({ default: m.ChannelsListPage })),
);
const ChannelCreatePage = lazy(() =>
  import('../pages/channels/ChannelCreatePage.jsx').then((m) => ({ default: m.ChannelCreatePage })),
);
const ChannelDetailPage = lazy(() =>
  import('../pages/channels/ChannelDetailPage.jsx').then((m) => ({ default: m.ChannelDetailPage })),
);
const ChannelEditPage = lazy(() =>
  import('../pages/channels/ChannelEditPage.jsx').then((m) => ({ default: m.ChannelEditPage })),
);

function LazyPage({ children }) {
  return <Suspense fallback={<LoadingScreen message="Loading page…" />}>{children}</Suspense>;
}

export function ChannelsRoutes() {
  return (
    <Routes>
      <Route
        index
        element={
          <LazyPage>
            <ChannelsListPage />
          </LazyPage>
        }
      />
      <Route
        path="new"
        element={
          <LazyPage>
            <ChannelCreatePage />
          </LazyPage>
        }
      />
      <Route
        path=":channelId/edit"
        element={
          <LazyPage>
            <ChannelEditPage />
          </LazyPage>
        }
      />
      <Route
        path=":channelId"
        element={
          <LazyPage>
            <ChannelDetailPage />
          </LazyPage>
        }
      />
    </Routes>
  );
}
