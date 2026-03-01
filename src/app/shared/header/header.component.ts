import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone:true
})
export class HeaderComponent  implements OnInit {
@Output() menuToggle = new EventEmitter<void>();

  toggleSidebar() {
    this.menuToggle.emit();
  }
  constructor() { }

  ngOnInit() {}

}
