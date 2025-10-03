import { UserRole, ROLE_PERMISSIONS, IRolePermissions } from '../constants/role.constants';

/**
 * Checks if a user has a specific permission based on their role
 * @param userRole - The user's role
 * @param permission - The permission to check
 * @returns boolean indicating if the user has the permission
 */
export const hasPermission = (
  userRole: string | undefined,
  permission: keyof IRolePermissions
): boolean => {
  if (!userRole || !Object.values(UserRole).includes(userRole as UserRole)) {
    return false;
  }
  
  return ROLE_PERMISSIONS[userRole as UserRole][permission];
};

/**
 * Checks if a user is an admin
 * @param userRole - The user's role
 * @returns boolean indicating if the user is an admin
 */
export const isAdmin = (userRole: string | undefined): boolean => {
  return userRole === UserRole.ADMIN;
};

/**
 * Checks if a user is a regular user
 * @param userRole - The user's role
 * @returns boolean indicating if the user is a regular user
 */
export const isUser = (userRole: string | undefined): boolean => {
  return userRole === UserRole.USER;
};

/**
 * Gets all permissions for a specific role
 * @param userRole - The user's role
 * @returns IRolePermissions object containing all permissions for the role
 */
export const getRolePermissions = (userRole: string | undefined): IRolePermissions => {
  if (!userRole || !Object.values(UserRole).includes(userRole as UserRole)) {
    return ROLE_PERMISSIONS[UserRole.USER];
  }
  
  return ROLE_PERMISSIONS[userRole as UserRole];
};

/**
 * Checks if a user can access a specific route based on their role
 * @param userRole - The user's role
 * @param requiredRoles - Array of roles that can access the route
 * @returns boolean indicating if the user can access the route
 */
export const canAccessRoute = (
  userRole: string | undefined,
  requiredRoles: UserRole[]
): boolean => {
  if (!userRole) {
    return false;
  }
  
  return requiredRoles.includes(userRole as UserRole);
};

/**
 * Gets the display name for a role
 * @param role - The role
 * @returns string with the display name for the role
 */
export const getRoleDisplayName = (role: string | undefined): string => {
  switch (role) {
    case UserRole.ADMIN:
      return 'Administrator';
    case UserRole.USER:
      return 'User';
    default:
      return 'Unknown';
  }
};

/**
 * Gets the color for a role badge
 * @param role - The role
 * @returns string with the color for the role badge
 */
export const getRoleColor = (role: string | undefined): 'primary' | 'success' | 'warning' | 'danger' | 'neutral' => {
  switch (role) {
    case UserRole.ADMIN:
      return 'danger';
    case UserRole.USER:
      return 'primary';
    default:
      return 'neutral';
  }
};


