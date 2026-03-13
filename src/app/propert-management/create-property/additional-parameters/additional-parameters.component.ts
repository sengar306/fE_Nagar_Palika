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

propertyTypes: string[] = [
  'अन्य',
  'अन्य प्रतिष्ठान',
  'अर्धसरकारी कार्यालय',
  'आवास और क्लिनिक',
  'आवास और दुकान',
  'आवास और मेडिकल स्टोर',
  'इमारत',
  'एटीएम',
  'ऑफिस',
  'औद्योगिक इकाइयां',
  'क्रीड़ा केंद्र',
  'क्लब',
  'कल्याण मंडप',
  'क्लिनिक',
  'कारखाना',
  'कोचिंग'
];

propertyCategories = [
  'Residential',
  'Commercial' ,
  'Mixed'
];
}
