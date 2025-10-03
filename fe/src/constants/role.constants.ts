export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export interface IRolePermissions {
  canCreateEvents: boolean;
  canEditEvents: boolean;
  canDeleteEvents: boolean;
  canViewAllBookings: boolean;
  canManageUsers: boolean;
  canViewAnalytics: boolean;
  canAccessAdminPanel: boolean;
}

export const ROLE_PERMISSIONS: Record<UserRole, IRolePermissions> = {
  [UserRole.USER]: {
    canCreateEvents: false,
    canEditEvents: false,
    canDeleteEvents: false,
    canViewAllBookings: false,
    canManageUsers: false,
    canViewAnalytics: false,
    canAccessAdminPanel: false,
  },
  [UserRole.ADMIN]: {
    canCreateEvents: true,
    canEditEvents: true,
    canDeleteEvents: true,
    canViewAllBookings: true,
    canManageUsers: true,
    canViewAnalytics: true,
    canAccessAdminPanel: true,
  },
};

export interface IRoleNavigation {
  label: string;
  path: string;
  icon: string;
  order: number;
  roles: UserRole[];
}

export const ROLE_NAVIGATION: IRoleNavigation[] = [
  {
    label: 'Dashboard',
    path: '/',
    icon: 'DashboardRoundedIcon',
    order: 1,
    roles: [UserRole.USER, UserRole.ADMIN],
  },
  {
    label: 'Events',
    path: '/events',
    icon: 'EventIcon',
    order: 2,
    roles: [UserRole.USER, UserRole.ADMIN],
  },
  {
    label: 'My Bookings',
    path: '/my-bookings',
    icon: 'BookOnlineIcon',
    order: 3,
    roles: [UserRole.USER],
  },
];

