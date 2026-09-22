import MenuIcon from '@mui/icons-material/Menu';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import Box from '@mui/material/Box';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { findNavItemByPath } from '../../constants/navigationConfig.js';
import { UserMenu } from './UserMenu.jsx';

/**
 * @param {{
 *   onToggleSidebar: () => void,
 *   sidebarCollapsed: boolean,
 *   onOpenMobileNav?: () => void,
 *   isMobile?: boolean,
 * }} props
 */
export function AppHeader({ onToggleSidebar, sidebarCollapsed, onOpenMobileNav, isMobile }) {
  const location = useLocation();
  const navItem = findNavItemByPath(location.pathname);
  const pageTitle = navItem?.label ?? 'Application';

  return (
    <Box
      component="header"
      className="flex items-center justify-between gap-3 border-b bg-white px-4"
      sx={{ borderColor: 'divider', minHeight: 56 }}
    >
      <Box className="flex min-w-0 flex-1 items-center gap-2">
        <IconButton
          aria-label={isMobile ? 'Open navigation menu' : sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          onClick={isMobile ? onOpenMobileNav : onToggleSidebar}
          edge="start"
          size="small"
        >
          {isMobile ? <MenuIcon fontSize="small" /> : sidebarCollapsed ? <MenuIcon fontSize="small" /> : <MenuOpenIcon fontSize="small" />}
        </IconButton>
        <Box className="min-w-0">
          <Breadcrumbs aria-label="Breadcrumb" sx={{ typography: 'caption', color: 'text.secondary' }}>
            <Typography component={RouterLink} to="/" color="inherit" sx={{ textDecoration: 'none' }}>
              Home
            </Typography>
            <Typography color="text.primary">{pageTitle}</Typography>
          </Breadcrumbs>
          <Typography variant="subtitle1" component="h1" noWrap fontWeight={600}>
            {pageTitle}
          </Typography>
        </Box>
      </Box>
      <UserMenu />
    </Box>
  );
}
