import { Routes } from '@angular/router';
import { LoginPageComponent } from './auth/component/login-page/login-page.component';
import { HomePage } from './home/home.page';
import { authGuard } from './auth/guards/auth-guard';

export const routes: Routes = [
 {
    path: 'login',
    component:LoginPageComponent
  },
  {
    path:'home',
    component:HomePage,
     canActivate: [authGuard]   

  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];
