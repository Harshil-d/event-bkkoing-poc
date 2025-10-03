import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Chip,
  Stack,
  Divider,
} from '@mui/joy';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import EventIcon from '@mui/icons-material/Event';
import PeopleIcon from '@mui/icons-material/People';
import BookOnlineIcon from '@mui/icons-material/BookOnline';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import { GlobalState } from '../../store/index.store';
import { getRoleDisplayName, getRoleColor } from '../../utilities/role.utility';
import RoleGuard from '../../components/Guards/RoleGuard';
import PermissionGuard from '../../components/Guards/PermissionGuard';
import { UserRole } from '../../constants/role.constants';

const AdminPanel: React.FC = () => {
  const user = useSelector((state: GlobalState) => state.user.user);
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalUsers: 0,
    totalBookings: 0,
    activeEvents: 0,
  });

  // Mock data - replace with actual API calls
  useEffect(() => {
    // Simulate loading stats
    setStats({
      totalEvents: 25,
      totalUsers: 150,
      totalBookings: 320,
      activeEvents: 8,
    });
  }, []);

  const adminFeatures = [
    {
      title: 'Event Management',
      description: 'Create, edit, and manage all events',
      icon: <EventIcon />,
      permission: 'canCreateEvents' as const,
      color: 'primary' as const,
    },
    {
      title: 'User Management',
      description: 'Manage user accounts and permissions',
      icon: <PeopleIcon />,
      permission: 'canManageUsers' as const,
      color: 'success' as const,
    },
    {
      title: 'Analytics Dashboard',
      description: 'View detailed analytics and reports',
      icon: <AnalyticsIcon />,
      permission: 'canViewAnalytics' as const,
      color: 'warning' as const,
    },
    {
      title: 'Booking Management',
      description: 'View and manage all bookings',
      icon: <BookOnlineIcon />,
      permission: 'canViewAllBookings' as const,
      color: 'neutral' as const,
    },
  ];

  return (
    <RoleGuard requiredRoles={[UserRole.ADMIN]}>
      <Box sx={{ p: 3 }}>
        <Box sx={{ mb: 4 }}>
          <Typography level="h2" sx={{ mb: 1 }}>
            Admin Panel
          </Typography>
          <Typography level="body-md" color="neutral">
            Welcome back, {user?.firstName}! Manage your event booking platform.
          </Typography>
        </Box>

        {/* Stats Overview */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                  <EventIcon color="primary" />
                  <Box>
                    <Typography level="h3">{stats.totalEvents}</Typography>
                    <Typography level="body-sm" color="neutral">
                      Total Events
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                  <PeopleIcon color="success" />
                  <Box>
                    <Typography level="h3">{stats.totalUsers}</Typography>
                    <Typography level="body-sm" color="neutral">
                      Total Users
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                  <BookOnlineIcon color="warning" />
                  <Box>
                    <Typography level="h3">{stats.totalBookings}</Typography>
                    <Typography level="body-sm" color="neutral">
                      Total Bookings
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                  <DashboardRoundedIcon color="error" />
                  <Box>
                    <Typography level="h3">{stats.activeEvents}</Typography>
                    <Typography level="body-sm" color="neutral">
                      Active Events
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Admin Features */}
        <Box sx={{ mb: 4 }}>
          <Typography level="h3" sx={{ mb: 2 }}>
            Admin Features
          </Typography>
          <Grid container spacing={3}>
            {adminFeatures.map((feature, index) => (
              <Grid xs={12} sm={6} md={4} key={index}>
                <PermissionGuard permission={feature.permission}>
                  <Card>
                    <CardContent>
                      <Stack spacing={2}>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Box sx={{ color: `${feature.color}.500` }}>
                            {feature.icon}
                          </Box>
                          <Typography level="title-md">
                            {feature.title}
                          </Typography>
                        </Stack>
                        <Typography level="body-sm" color="neutral">
                          {feature.description}
                        </Typography>
                        <Button
                          variant="soft"
                          color={feature.color}
                          size="sm"
                          sx={{ alignSelf: 'flex-start' }}
                        >
                          Access Feature
                        </Button>
                      </Stack>
                    </CardContent>
                  </Card>
                </PermissionGuard>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* User Role Info */}
        <Card>
          <CardContent>
            <Typography level="h4" sx={{ mb: 2 }}>
              Your Admin Privileges
            </Typography>
            <Stack spacing={2}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Typography level="body-md">Role:</Typography>
                <Chip
                  color={getRoleColor(user?.role)}
                  variant="soft"
                  size="sm"
                >
                  {getRoleDisplayName(user?.role)}
                </Chip>
              </Stack>
              <Divider />
              <Typography level="body-sm" color="neutral">
                As an administrator, you have full access to manage events, users, 
                and view analytics. Use the features above to manage your platform.
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </RoleGuard>
  );
};

export default AdminPanel;
