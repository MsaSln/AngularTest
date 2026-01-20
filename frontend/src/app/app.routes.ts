import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { Dashboard } from './components/dashboard/dashboard';
import { Layout } from './components/layout/layout';
import { MenuManagement } from './components/menu-management/menu-management';
import { UserManagement } from './components/user-management/user-management';
import { RoleManagement } from './components/role-management/role-management';
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
      { path: 'dashboard', component: Dashboard },
      { path: 'menu-management', component: MenuManagement },
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
    ]
  },
  { path: '**', redirectTo: '/dashboard' },
];
