import { Routes } from '@angular/router';
import { DashboardUiComponent } from '../../projects/file-config-library/src/public-api';
// for local library run
// import { DashboardUiComponent } from '../../projects/file-config-library/src/lib/file-config-library.component';

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
