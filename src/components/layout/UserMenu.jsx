import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth.js';

function getInitials(email) {
  if (!email) return '?';
  const part = email.split('@')[0] ?? '';
  return part.slice(0, 2).toUpperCase() || '?';
}

export function UserMenu() {
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(/** @type {HTMLElement | null} */ (null));
  const open = Boolean(anchorEl);

  const handleLogout = async () => {
    setAnchorEl(null);
    await logout();
  };

  return (
    <>
      <IconButton
        onClick={(event) => setAnchorEl(event.currentTarget)}
        aria-label="Open account menu"
        aria-controls={open ? 'user-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        size="small"
      >
        <Avatar sx={{ width: 32, height: 32, fontSize: 14 }} aria-hidden>
          {getInitials(user?.email)}
        </Avatar>
      </IconButton>
      <Menu
        id="user-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem disabled sx={{ opacity: 1, flexDirection: 'column', alignItems: 'flex-start' }}>
          <Typography variant="body2" fontWeight={600}>
            {user?.email ?? 'Signed in'}
          </Typography>
          {user?.membershipStatus ? (
            <Typography variant="caption" color="text.secondary">
              Membership: {user.membershipStatus}
            </Typography>
          ) : null}
          {user?.tenantId ? (
            <Typography variant="caption" color="text.secondary" display="block">
              Tenant ID: {user.tenantId}
            </Typography>
          ) : null}
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutOutlinedIcon fontSize="small" aria-hidden />
          </ListItemIcon>
          Sign out
        </MenuItem>
      </Menu>
    </>
  );
}
