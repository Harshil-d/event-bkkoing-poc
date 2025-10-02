import GlobalStyles from '@mui/joy/GlobalStyles';
import Avatar from '@mui/joy/Avatar';
import Box from '@mui/joy/Box';
import Divider from '@mui/joy/Divider';
import IconButton from '@mui/joy/IconButton';
import List from '@mui/joy/List';
import { listItemButtonClasses } from '@mui/joy/ListItemButton';
import Typography from '@mui/joy/Typography';
import Sheet from '@mui/joy/Sheet';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import GroupRoundedIcon from '@mui/icons-material/GroupRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import Groups2Icon from '@mui/icons-material/Groups2';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import EventIcon from '@mui/icons-material/Event';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import BusinessIcon from '@mui/icons-material/Business';
import Person2Icon from '@mui/icons-material/Person2';

import { ColorSchemeToggle } from '../UI/ColorSchemeToggle';
import CompanyLogo from '../../assets/images/full-logo.png';
import SidebarLink from './SidebarLink';
import { clearAuthSession } from '../../helpers/api.helper';
import { useNavigate } from 'react-router-dom';
import { GlobalState } from '../../store/index.store';
import { useSelector } from 'react-redux';
import { Skeleton, Stack } from '@mui/joy';
import { closeSidebar } from '../../utilities/sidebar.utility';

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const user = useSelector((state: GlobalState) => state.user.user);

  const signOutHandler = () => {
    clearAuthSession();
    navigate('/sign-in');
  };

  const adminOnlyLinks = [
    {
      text: 'Dietitian Group',
      path: '/dietitian-group',
      icon: <BusinessIcon />,
      order: 8,
    },
  ];

  const links = [
    {
      text: 'Dashboard',
      path: '/',
      icon: <DashboardRoundedIcon />,
      order: 1,
    },
    {
      text: 'Clients',
      path: '/clients',
      icon: <GroupRoundedIcon />,
      order: 2,
    },
    {
      text: 'Diets',
      path: '/diets',
      icon: <MenuBookIcon />,
      order: 3,
    },
    {
      text: 'Dietitians',
      path: '/dietitians',
      icon: <Groups2Icon />,
      order: 4,
    },
    {
      text: 'Diet Plans',
      path: '/diet-plans',
      icon: <ReceiptLongIcon />,
      order: 5,
    },
    {
      text: 'Tasks',
      path: '/tasks',
      icon: <AssignmentRoundedIcon />,
      order: 6,
    },
    {
      text: 'Appointments',
      path: '/appointments',
      icon: <EventIcon />,
      order: 7,
    },
    {
      text: 'My Profile',
      path: '/my-profile',
      icon: <Person2Icon />,
      order: 9,
    },
  ];

  return (
    <Sheet
      className='Sidebar'
      sx={{
        position: { xs: 'fixed', md: 'sticky' },
        transform: {
          xs: 'translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1)))',
          md: 'none',
        },
        transition: 'transform 0.4s, width 0.4s',
        zIndex: 10000,
        height: '100dvh',
        width: 'var(--Sidebar-width)',
        top: 0,
        p: 2,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        borderRight: '1px solid',
        borderColor: 'divider',
      }}
    >
      <GlobalStyles
        styles={(theme) => ({
          ':root': {
            '--Sidebar-width': '220px',
            [theme.breakpoints.up('lg')]: {
              '--Sidebar-width': '240px',
            },
          },
        })}
      />
      <Box
        className='Sidebar-overlay'
        sx={{
          position: 'fixed',
          zIndex: 9998,
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          opacity: 'var(--SideNavigation-slideIn)',
          backgroundColor: 'var(--joy-palette-background-backdrop)',
          transition: 'opacity 0.4s',
          transform: {
            xs: 'translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1) + var(--SideNavigation-slideIn, 0) * var(--Sidebar-width, 0px)))',
            lg: 'translateX(-100%)',
          },
        }}
        onClick={() => closeSidebar()}
      />
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        <img src={CompanyLogo} alt='EvoDietics' height={30} />
        <Box sx={{ ml: 'auto' }}>
          <ColorSchemeToggle />
        </Box>
      </Box>
      <Box
        sx={{
          minHeight: 0,
          overflow: 'hidden auto',
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          [`& .${listItemButtonClasses.root}`]: {
            gap: 1.5,
          },
        }}
      >
        <List
          size='sm'
          sx={{
            gap: 1,
            '--List-nestedInsetStart': '30px',
            '--ListItem-radius': (theme) => theme.vars.radius.sm,
          }}
        >
          {[...adminOnlyLinks, ...links]
            .sort((a, b) => a.order - b.order)
            .map(({ text, path, icon }) => (
              <SidebarLink text={text} path={path} key={text}>
                {icon}
              </SidebarLink>
            ))}
        </List>
      </Box>
      <Divider />
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        <Avatar
          variant='outlined'
          size='sm'
          src='https://healthmine.in/assets/images/logo.png'
        />
        <Box sx={{ minWidth: 0, flex: 1 }}>
          {user ? (
            <>
              <Typography level='title-sm'>
                {`${user?.firstName} ${user?.lastName}`.trim()}
              </Typography>
              <Typography level='body-xs'>{user?.role}</Typography>
              <Typography level='body-xs'>
                {user?.dietitianGroupName}
              </Typography>
            </>
          ) : (
            <Stack spacing={0}>
              <Skeleton variant='text' level='title-sm' width={120} />
              <Skeleton variant='text' level='body-xs' width={100} />
              <Skeleton variant='text' level='body-xs' width={120} />
            </Stack>
          )}
        </Box>
        <IconButton
          size='sm'
          variant='plain'
          color='neutral'
          onClick={signOutHandler}
        >
          <LogoutRoundedIcon />
        </IconButton>
      </Box>
    </Sheet>
  );
};

export default Sidebar;
