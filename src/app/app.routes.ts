import { Routes } from '@angular/router';

import { AuthGuard } from './services/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [AuthGuard],
  },
  {
    path: 'users',
    loadChildren: () => import('./pages/users/users.module').then(m => m.UsersModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'users/:id',
    loadComponent: () => import('./pages/user-details/user-details.component').then(m => m.UserDetailsComponent),
    canActivate: [AuthGuard],
  },
  {
    path: 'content',
    loadComponent: () => import('./pages/manage-content/manage-content').then(m => m.ManageContent),
    canActivate: [AuthGuard],
  },
  {
    path: 'content/:type',
    loadComponent: () => import('./pages/content-list/content-list.component').then(m => m.ContentListComponent),
    canActivate: [AuthGuard],
  },
  {
    path: 'content/:type/add',
    loadComponent: () => import('./pages/edit-content/edit-content').then(m => m.EditContentComponent),
    data: { isEdit: false },
    canActivate: [AuthGuard],
  },
  {
    path: 'content/:type/edit/:id',
    loadComponent: () => import('./pages/edit-content/edit-content').then(m => m.EditContentComponent),
    data: { isEdit: true },
    canActivate: [AuthGuard],
  },
  {
    path: 'subscriptions',
    loadComponent: () => import('./pages/subscription-list/subscription-list').then(m => m.default),
    canActivate: [AuthGuard],
  },
  {
    path: 'subscriptions/new',
    loadComponent: () => import('./pages/subscription-form/subscription-form').then(m => m.SubscriptionForm),
    canActivate: [AuthGuard],
  },
  {
    path: 'subscriptions/edit/:id',
    loadComponent: () => import('./pages/subscription-form/subscription-form').then(m => m.SubscriptionForm),
    canActivate: [AuthGuard],
  },
  {
    path: 'countries-languages',
    loadComponent: () => import('./pages/countries-languages/countries-languages').then(m => m.CountriesLanguages),
    canActivate: [AuthGuard],
  },
  {
    path: 'countries-languages/:type',
    loadComponent: () => import('./pages/countries-languages-list/countries-languages-list.component').then(m => m.CountriesLanguagesListComponent),
    canActivate: [AuthGuard],
  },
  {
    path: 'countries-languages/:type/add',
    loadComponent: () => import('./pages/countries-languages-edit/countries-languages-edit.component').then(m => m.CountriesLanguagesEditComponent),
    data: { isEdit: false },
    canActivate: [AuthGuard],
  },
  {
    path: 'countries-languages/:type/edit/:id',
    loadComponent: () => import('./pages/countries-languages-edit/countries-languages-edit.component').then(m => m.CountriesLanguagesEditComponent),
    data: { isEdit: true },
    canActivate: [AuthGuard],
  },
];
