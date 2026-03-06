import { Component, OnInit } from '@angular/core';
import { CreatePropertyComponent } from "./create-property/create-property.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-propert-management',
  templateUrl: './propert-management.component.html',
  styleUrls: ['./propert-management.component.scss'],
  imports: [CreatePropertyComponent,CommonModule],
})
export class PropertManagementComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}
isModal = false;

openModal() {
  this.isModal = true;
}

closeModal() {
  this.isModal = false;
}
}
