import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-property-floor-details',
   imports: [ReactiveFormsModule],
  templateUrl: './property-floor-details.component.html',
  styleUrls: ['./property-floor-details.component.scss'],
})
export class PropertyFloorDetailsComponent  implements OnInit {

 @Input () propertyForm:any
  ngOnInit() {}
 

  constructor(private fb: FormBuilder) {}

  // Floor array getter
  get floors() {
    return this.propertyForm.get('floors') as FormArray;
  }

  // Nayi row add karne ke liye
  // addFloor() {
  //   const floorGroup = this.fb.group({
  //     floor: [''],
  //     category: [null],
  //     constructionType: [null],
  //     mrr: [{value: '', disabled: true}], // Image ke hisaab se
  //     builtUpArea: [0],
  //     emptyArea: [0],
  //     arv: [0]
  //   });
  //   this.floors.push(floorGroup);
  // }
// 1. Naya floor add karte waqt logic
addFloor() {
  const mainPropertyType = this.propertyForm.get('propertyCategoryId')?.value; // Step 1 ki value
  let floorCategory = null;
  if (mainPropertyType === 'Residential' || mainPropertyType === 'Commercial') {
    floorCategory = mainPropertyType;
  }

  const floorGroup = this.fb.group({
    category: [floorCategory], // Pre-fill value
    constructionType: [null],
    mrr: [''],
    builtUpArea: [0],
    emptyArea: [0],
    arv: [0]
  });

  this.floors.push(floorGroup);
}

// 2. Agar user peeche jaakar Property Type badal de, to saare floors update ho jayein
// Ise ngOnInit mein likhein
trackPropertyTypeChanges() {
  this.propertyForm.get('propertyType')?.valueChanges.subscribe((type:any) => {
    if (type === 'Residential' || type === 'Commercial') {
      // Saare existing floors ki category update kar do
      this.floors.controls.forEach(control => {
        control.get('category')?.setValue(type);
      });
    }
  });
}
  // Row remove karne ke liye
  removeFloor(index: number) {
    if (this.floors.length > 1) {
      this.floors.removeAt(index);
    }
  }
   activeAccordionIndex: number = 0;

  // get floors() {
  //   return this.propertyForm.get('floors') as FormArray;
  // }

  // addFloor() {
  //   const floorGroup = this.fb.group({
  //     category: [null],
  //     constructionType: [null],
  //     mrr: [''],
  //     builtUpArea: [0],
  //     emptyArea: [0],
  //     arv: [0]
  //   });
  //   this.floors.push(floorGroup);
  //   // Naya floor add hote hi usey open kar do
  //   this.activeAccordionIndex = this.floors.length - 1;
  // }

  // removeFloor(index: number) {
  //   if (this.floors.length > 1) {
  //     this.floors.removeAt(index);
  //     this.activeAccordionIndex = this.floors.length - 1;
  //   }
  // }

  toggleAccordion(index: number) {
    this.activeAccordionIndex = this.activeAccordionIndex === index ? -1 : index;
  }
  constructionTypes: string[] = [
  'अन्य पक्का भवन, एस्बेस्टस / फाइबर या टीन शेड',
  'कच्चा भवन या अन्य समस्त भवन',
  'पक्का भवन / RCC या RBC छत सहित'
];
  propertyCategories = [
    'Residential',
    'Commercial',
    'Mixed'
  ];
}
