import { inject } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot } from '@angular/router';
import { PermissionService } from '../services/permission.service';

export const permissionGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const permissionService = inject(PermissionService);
  const router = inject(Router);

  const requiredPermissions = route.data['permissions'] as string[];

  if (!requiredPermissions || requiredPermissions.length === 0) {
    return true;
  }

  const logicalOp = route.data['permissionsOp'] as 'AND' | 'OR' || 'OR';

  const hasPermission = logicalOp === 'AND'
    ? permissionService.hasAllPermissions(requiredPermissions)
    : permissionService.hasAnyPermission(requiredPermissions);

  if (!hasPermission) {
    router.navigate(['/dashboard']);
    return false;
  }

  return true;
};
