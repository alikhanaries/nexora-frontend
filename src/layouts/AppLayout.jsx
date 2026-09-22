import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AppHeader } from '../components/layout/AppHeader.jsx';
import { Sidebar } from '../components/layout/Sidebar.jsx';
import { sidebarWidths } from '../constants/sidebar.js';

export function AppLayout() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const sidebarContent = (
    <Sidebar collapsed={!isMobile && collapsed} onNavigate={() => setMobileOpen(false)} />
  );

  return (
    <Box className="flex min-h-screen bg-[#f4f6f8]" sx={{ bgcolor: 'background.default' }}>
      {!isMobile ? (
        <Box component="aside" sx={{ flexShrink: 0 }}>
          {sidebarContent}
        </Box>
      ) : (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': {
              width: sidebarWidths.expanded,
              boxSizing: 'border-box',
            },
          }}
        >
          {sidebarContent}
        </Drawer>
      )}

      <Box className="flex min-w-0 flex-1 flex-col">
        <AppHeader
          isMobile={isMobile}
          sidebarCollapsed={collapsed}
          onToggleSidebar={() => setCollapsed((prev) => !prev)}
          onOpenMobileNav={() => setMobileOpen(true)}
        />
        <Box component="main" className="flex-1 px-4 py-6 md:px-6" id="main-content">
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
