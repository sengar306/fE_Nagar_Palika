import { Routes } from '@angular/router';
import { LoginPageComponent } from './auth/component/login-page/login-page.component';
import { HomePage } from './home/home.page';
import { authGuard } from './auth/guards/auth-guard';
import { PropertManagementComponent } from './propert-management/propert-management.component';
import { DashBoardComponent } from './dash-board/dash-board.component';
import { PropertyDetailsComponent } from './propert-management/property-details/property-details.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginPageComponent,
  },
  {
    path: 'home',
    component: HomePage,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'property', component: PropertManagementComponent },
      { path: 'dashboard', component: DashBoardComponent },
      {
        path: 'property/:id',
        component: PropertyDetailsComponent,
      },
        {
    path:'bill-payment',
    loadChildren: () => import('./bill-payment/bill-dashboard/bill-dashboard-module').then(m => m.BillDashboardModule),
    canActivate: [authGuard]
  }
    ],
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },

];
