import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { NavLink } from 'react-router-dom';
import { navigationConfig } from '../../constants/navigationConfig.js';
import { navigationIcons } from '../../constants/navigationIcons.jsx';
import { sidebarWidths } from '../../constants/sidebar.js';

/**
 * @param {{ collapsed: boolean, onNavigate?: () => void }} props
 */
export function Sidebar({ collapsed, onNavigate }) {
  const sections = navigationConfig.reduce((acc, item) => {
    const section = item.section ?? 'Main';
    if (!acc[section]) acc[section] = [];
    acc[section].push(item);
    return acc;
  }, /** @type {Record<string, typeof navigationConfig>} */ ({}));

  return (
    <Box
      component="nav"
      aria-label="Main navigation"
      className="flex h-full flex-col border-r bg-white"
      sx={{
        width: collapsed ? sidebarWidths.collapsed : sidebarWidths.expanded,
        borderColor: 'divider',
        transition: (theme) =>
          theme.transitions.create('width', { duration: theme.transitions.duration.shortest }),
      }}
    >
      <Box
        className="flex items-center justify-center px-3 py-4"
        sx={{ minHeight: 56, justifyContent: collapsed ? 'center' : 'flex-start' }}
      >
        <Typography variant="subtitle1" fontWeight={600} noWrap aria-label="Nexora">
          {collapsed ? 'N' : 'Nexora'}
        </Typography>
      </Box>
      <Divider />
      <Box className="flex-1 overflow-y-auto py-2">
        {Object.entries(sections).map(([section, items]) => (
          <Box key={section} component="section" aria-label={section} sx={{ mb: 1 }}>
            {!collapsed ? (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ px: 2, py: 1, display: 'block', fontWeight: 600, letterSpacing: 0.4 }}
              >
                {section.toUpperCase()}
              </Typography>
            ) : null}
            <List dense disablePadding>
              {items.map((item) => {
                const Icon = navigationIcons[item.id] ?? DashboardOutlinedIcon;
                const link = (
                  <ListItemButton
                    component={NavLink}
                    to={item.path}
                    end={item.path === '/'}
                    onClick={onNavigate}
                    aria-label={collapsed ? item.label : undefined}
                    sx={{
                      minHeight: 40,
                      px: collapsed ? 1.5 : 2,
                      justifyContent: collapsed ? 'center' : 'flex-start',
                      '&.active': {
                        bgcolor: 'action.selected',
                        borderRight: 2,
                        borderColor: 'primary.main',
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: collapsed ? 0 : 36,
                        justifyContent: 'center',
                        color: 'text.secondary',
                      }}
                    >
                      <Icon fontSize="small" aria-hidden />
                    </ListItemIcon>
                    {!collapsed ? (
                      <ListItemText primary={item.label} primaryTypographyProps={{ variant: 'body2' }} />
                    ) : null}
                  </ListItemButton>
                );

                return (
                  <ListItem key={item.id} disablePadding sx={{ display: 'block' }}>
                    {collapsed ? (
                      <Tooltip title={item.label} placement="right" arrow>
                        {link}
                      </Tooltip>
                    ) : (
                      link
                    )}
                  </ListItem>
                );
              })}
            </List>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
