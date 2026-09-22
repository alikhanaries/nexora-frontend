import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { ErrorBoundary } from '../components/common/ErrorBoundary.jsx';
import { NotificationProvider } from '../components/common/NotificationProvider.jsx';
import { createQueryClient } from '../config/queryClient.js';
import { appTheme } from '../theme/index.js';
import { AuthProvider } from './AuthProvider.jsx';

const queryClient = createQueryClient();

export function AppProviders({ children }) {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={appTheme}>
          <CssBaseline />
          <NotificationProvider>
            <BrowserRouter>
              <AuthProvider>{children}</AuthProvider>
            </BrowserRouter>
          </NotificationProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
