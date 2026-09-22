import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import HubOutlinedIcon from '@mui/icons-material/HubOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import PlaylistAddCheckOutlinedIcon from '@mui/icons-material/PlaylistAddCheckOutlined';
import QueueOutlinedIcon from '@mui/icons-material/QueueOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import SyncOutlinedIcon from '@mui/icons-material/SyncOutlined';
import UndoOutlinedIcon from '@mui/icons-material/UndoOutlined';

/** @type {Record<string, import('@mui/material/SvgIcon').default>} */
export const navigationIcons = {
  overview: DashboardOutlinedIcon,
  products: CategoryOutlinedIcon,
  inventory: Inventory2OutlinedIcon,
  pricing: ReceiptLongOutlinedIcon,
  orders: PlaylistAddCheckOutlinedIcon,
  shipments: LocalShippingOutlinedIcon,
  returns: UndoOutlinedIcon,
  channels: StorefrontOutlinedIcon,
  integrations: HubOutlinedIcon,
  sync: SyncOutlinedIcon,
  queue: QueueOutlinedIcon,
  audit: AssessmentOutlinedIcon,
  settings: SettingsOutlinedIcon,
};
