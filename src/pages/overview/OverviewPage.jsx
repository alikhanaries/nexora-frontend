import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { Link as RouterLink } from 'react-router-dom';
import { PageHeader } from '../../components/common/PageHeader.jsx';
import { navigationConfig } from '../../constants/navigationConfig.js';
import { navigationIcons } from '../../constants/navigationIcons.jsx';
import { useAuth } from '../../hooks/useAuth.js';
import { filterNavigationItems } from '../../utils/filterNavigationItems.js';

export function OverviewPage() {
  const { permissions, isRbacAvailable, isLoading, user } = useAuth();

  const modules = filterNavigationItems(
    navigationConfig.filter((item) => item.id !== 'overview'),
    { permissions, isRbacAvailable: isRbacAvailable && !isLoading },
  );

  const sections = modules.reduce((acc, item) => {
    const section = item.section ?? 'Main';
    if (!acc[section]) acc[section] = [];
    acc[section].push(item);
    return acc;
  }, /** @type {Record<string, typeof navigationConfig>} */ ({}));

  return (
    <>
      <PageHeader
        title="Overview"
        description={
          user?.email
            ? `Signed in as ${user.email}. Open a module below to manage your tenant.`
            : 'Open a module below to manage your tenant.'
        }
      />
      <Typography variant="body2" color="text.secondary" paragraph>
        Nexora does not expose a separate analytics dashboard API. This page lists the modules available in
        your workspace. Access still depends on backend permissions (403 if not allowed).
      </Typography>
      <Box className="flex flex-col gap-4">
        {Object.entries(sections).map(([section, items]) => (
          <Paper key={section} variant="outlined" className="p-4">
            <Typography variant="subtitle2" gutterBottom>
              {section}
            </Typography>
            <Box className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => {
                const Icon = navigationIcons[item.id];
                return (
                  <Button
                    key={item.id}
                    component={RouterLink}
                    to={item.path}
                    variant="outlined"
                    size="small"
                    startIcon={Icon ? <Icon fontSize="small" /> : undefined}
                    sx={{ justifyContent: 'flex-start', py: 1.25 }}
                  >
                    {item.label}
                  </Button>
                );
              })}
            </Box>
          </Paper>
        ))}
      </Box>
    </>
  );
}
