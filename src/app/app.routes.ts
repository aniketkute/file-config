import { Routes } from '@angular/router';
import { DashboardUiComponent } from '../../projects/file-config-library/src/public-api';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    component: DashboardUiComponent,
  },
];
