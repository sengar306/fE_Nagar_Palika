import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-annual-calculation',
  templateUrl: './annual-calculation.component.html',
  styleUrls: ['./annual-calculation.component.scss'],
  imports:[ReactiveFormsModule]
})
export class AnnualCalculationComponent  implements OnInit {

  constructor() { }
@Input() propertyForm!:FormGroup
  ngOnInit() {}

}
