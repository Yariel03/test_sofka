import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full',
  },
  {
    path: 'list',
    loadComponent: () => import('./pages/list/list'),
  },
  {
    path: 'new/:id',
    loadComponent: () => import('./pages/new/new'),
  },
  {
    path: '**',
    redirectTo: 'list',
  },
];
