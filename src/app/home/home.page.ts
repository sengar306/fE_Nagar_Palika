import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { SideBarComponent } from '../shared/side-bar/side-bar.component';
import { HeaderComponent } from '../shared/header/header.component';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
imports: [IonicModule, CommonModule, RouterModule,SideBarComponent,HeaderComponent],
  
})
export class HomePage {
  constructor() {}
  isSidebarOpen = false;

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}
