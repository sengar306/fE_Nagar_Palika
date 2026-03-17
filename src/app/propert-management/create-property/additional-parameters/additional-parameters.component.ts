import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-additional-parameters',
  templateUrl: './additional-parameters.component.html',
  styleUrls: ['./additional-parameters.component.scss'],
  imports:[ReactiveFormsModule,CommonModule]
})
export class AdditionalParametersComponent  implements OnInit {
@Input() propertyForm!:FormGroup

constructor(private fb: FormBuilder) {}
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
]


get floors(): FormArray {
  const floors = this.propertyForm.get('floors');
  return floors ? (floors as FormArray) : this.fb.array([]);
}

toggleAccordion(index: number) {
  this.floors.controls.forEach((floor: any, i: number) => {
    const current = floor.get('expanded')?.value;

    floor.get('expanded')?.setValue(i === index ? !current : false);
  });
}
}
