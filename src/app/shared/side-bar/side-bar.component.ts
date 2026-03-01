import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss'],  
  standalone:true

})
export class SideBarComponent  implements OnInit {
  @Input() isOpen = false;
  constructor() { }

  ngOnInit() {}

}
