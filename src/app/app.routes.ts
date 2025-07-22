import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
  },
  {
    path: 'users',
    loadChildren: () => import('./pages/users/users.module').then(m => m.UsersModule),
  },
  {
    path: 'content',
    loadComponent: () => import('./pages/manage-content/manage-content').then(m => m.ManageContent),
  },
  {
    path: 'content/:type',
    loadComponent: () => import('./pages/edit-content/edit-content').then(m => m.EditContentComponent),
  },
  // Placeholder for future modules
  // {
  //   path: 'settings',
  //   loadComponent: () => import('./pages/settings/settings.component').then(m => m.SettingsComponent),
  // },
];
