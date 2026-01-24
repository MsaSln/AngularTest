import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { Dashboard } from './components/dashboard/dashboard';
import { Layout } from './components/layout/layout';
import { MenuManagement } from './components/menu-management/menu-management';
import { UserManagement } from './components/user-management/user-management';
import { RoleManagement } from './components/role-management/role-management';
import { VehicleManagement } from './components/medops/vehicle-management/vehicle-management';
import { LocationManagement } from './components/medops/location-management/location-management';
import { PersonnelManagement } from './components/medops/personnel-management/personnel-management';
import { TeamManagement } from './components/medops/team-management/team-management';
import { authGuard } from './guards/auth-guard';
import { permissionGuard } from './guards/permission.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  {
    path: '',
    component: Layout,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        component: Dashboard,
        canActivate: [permissionGuard],
        data: { permissions: ['dashboard.view'], permissionsOp: 'OR' }
      },
      {
        path: 'menu-management',
        component: MenuManagement,
        canActivate: [permissionGuard],
        data: { permissions: ['menu.groups.view', 'menu.items.view'], permissionsOp: 'OR' }
      },
      {
        path: 'user-management',
        component: UserManagement,
        canActivate: [permissionGuard],
        data: { permissions: ['users.view'], permissionsOp: 'OR' }
      },
      {
        path: 'role-management',
        component: RoleManagement,
        canActivate: [permissionGuard],
        data: { permissions: ['roles.view'], permissionsOp: 'OR' }
      },
      {
        path: 'vehicles',
        component: VehicleManagement,
        canActivate: [permissionGuard],
        data: { permissions: ['vehicles.view'], permissionsOp: 'OR' }
      },
      {
        path: 'locations',
        component: LocationManagement,
        canActivate: [permissionGuard],
        data: { permissions: ['locations.view'], permissionsOp: 'OR' }
      },
      {
        path: 'personnel',
        component: PersonnelManagement,
        canActivate: [permissionGuard],
        data: { permissions: ['personnel.view'], permissionsOp: 'OR' }
      },
      {
        path: 'teams',
        component: TeamManagement,
        canActivate: [permissionGuard],
        data: { permissions: ['teams.view'], permissionsOp: 'OR' }
      },
    ]
  },
  { path: '**', redirectTo: '/dashboard' },
];
