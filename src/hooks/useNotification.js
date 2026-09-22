import { useContext } from 'react';
import { NotificationContext } from '../components/common/notificationContext.js';

export function useNotification() {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return ctx;
}
