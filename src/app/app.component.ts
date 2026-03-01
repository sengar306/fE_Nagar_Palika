import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { LoginPageComponent } from './auth/component/login-page/login-page.component';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp,RouterModule],
  
})
export class AppComponent {
  constructor() {}
}
