import { Component } from '@angular/core';
import { IonApp } from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';
import { LoaderOverlayComponent } from './shared/ui/loader-overlay/loader-overlay.component';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrl: 'app.component.scss',
  imports: [IonApp, RouterModule, LoaderOverlayComponent],
})
export class AppComponent {
  constructor() {}
}
