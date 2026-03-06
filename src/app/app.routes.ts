import { Routes } from '@angular/router';
import { LoginPageComponent } from './auth/component/login-page/login-page.component';
import { HomePage } from './home/home.page';
import { authGuard } from './auth/guards/auth-guard';
import { PropertManagementComponent } from './propert-management/propert-management.component';
import { DashBoardComponent } from './dash-board/dash-board.component';

export const routes: Routes = [
 {
    path: 'login',
    component:LoginPageComponent
  },
  {
    path:'home',
    component:HomePage,
     canActivate: [authGuard]   ,
       children: [
      { path: 'property', component: PropertManagementComponent },
      {path:'dashboard',component:DashBoardComponent}

    ]

  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];
