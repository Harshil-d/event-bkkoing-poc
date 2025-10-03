import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { GlobalState } from '../../store/index.store';
import { canAccessRoute } from '../../utilities/role.utility';
import { UserRole } from '../../constants/role.constants';

interface IRoleGuardProps {
  children: React.ReactNode;
  requiredRoles: UserRole[];
  fallbackPath?: string;
}

const RoleGuard: React.FC<IRoleGuardProps> = ({ 
  children, 
  requiredRoles, 
  fallbackPath = '/events' 
}) => {
  const user = useSelector((state: GlobalState) => state.user.user);

  // If user is not loaded yet, show loading or return null
  if (!user) {
    return null;
  }

  // Check if user has access to this route
  const hasAccess = canAccessRoute(user.role, requiredRoles);

  if (!hasAccess) {
    return <Navigate to={fallbackPath} replace />;
  }

  return <>{children}</>;
};

export default RoleGuard;


