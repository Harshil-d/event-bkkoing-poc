import React from 'react';
import { useSelector } from 'react-redux';

import { GlobalState } from '../../store/index.store';
import { hasPermission } from '../../utilities/role.utility';
import { IRolePermissions } from '../../constants/role.constants';

interface IPermissionGuardProps {
  children: React.ReactNode;
  permission: keyof IRolePermissions;
  fallback?: React.ReactNode;
}

const PermissionGuard: React.FC<IPermissionGuardProps> = ({ 
  children, 
  permission, 
  fallback = null 
}) => {
  const user = useSelector((state: GlobalState) => state.user.user);

  // If user is not loaded yet, show fallback
  if (!user) {
    return <>{fallback}</>;
  }

  // Check if user has the required permission
  const hasRequiredPermission = hasPermission(user.role, permission);

  if (!hasRequiredPermission) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

export default PermissionGuard;


