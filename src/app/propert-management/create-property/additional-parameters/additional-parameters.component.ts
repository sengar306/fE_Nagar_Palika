import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-additional-parameters',
  templateUrl: './additional-parameters.component.html',
  styleUrls: ['./additional-parameters.component.scss'],
  imports:[ReactiveFormsModule]
})
export class AdditionalParametersComponent  implements OnInit {
@Input() propertyForm!:FormGroup
  constructor() { }

  ngOnInit() {}
propertyTypes = [
 'Residential',
'Commercial',
 'Industrial'
];

propertyCategories = [
  'Residential',
  'Commercial' 
];
}
