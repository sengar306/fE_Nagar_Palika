    import { Component, EventEmitter, OnInit, Output } from '@angular/core';
    import { BasicPropertyDetailsComponent } from './basic-property-details/basic-property-details.component';
    import { AdditionalParametersComponent } from './additional-parameters/additional-parameters.component';
    import { PropertyFloorDetailsComponent } from './property-floor-details/property-floor-details.component';
    import { AnnualCalculationComponent } from './annual-calculation/annual-calculation.component';
  import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
  import { CommonModule } from '@angular/common';
import { PropertyManagemnetService } from '../property-managemnet-service';

    @Component({
      selector: 'app-create-property',
      templateUrl: './create-property.component.html',
      styleUrls: ['./create-property.component.scss'],
      imports:[BasicPropertyDetailsComponent,AdditionalParametersComponent,PropertyFloorDetailsComponent,AnnualCalculationComponent,ReactiveFormsModule]
    })
 export class CreatePropertyComponent implements OnInit {

  propertyForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private service: PropertyManagemnetService
  ) {}

  ngOnInit(): void {

    this.setHeading();

    this.propertyForm = this.fb.group({
      propertyType:[null],
      zone: [null],
      ward: [null],
      locality: [null],
      ptin: [''],
      ownership: [''],
      ownerName: [''],
      fatherName: [''],
      mobileNo: [''],
      gender: [''],

      // 🔥 NEW LOGIC FIELDS
      isPlotEmpty: [false],
      totalPlotArea: [''],
      noOfFloors: [0],

      // Address
      houseNo: [''],
      oldHouseNo: [''],
      propertySequenceNo: [''],

      propertyTypeId: [null],
      propertyCategoryId: [null],

      arvResidential: [0],
      arvCommercial: [0],
      arvEffectiveFrom: [null],

      // 👇 MAIN THING
      floors: this.fb.array([]),
houseAge:[''],
wardName:[''],
sequenceNo:[null],
streetNo:[null],
roadWidth:[''],
streetName:[''],
plotArea:[''],
builtType:[''],
isRented:[false],
      houseTax: [false],
      waterTax: [false],
      sewerTax: [false],
      deactivateOldProperty: [false],

      arrearHouseTax: [0],
      arrearWaterTax: [0],
      arrearSewerTax: [0],

      surchargeHouseTax: [0],
      surchargeWaterTax: [0],
      surchargeSewerTax: [0],

      proposedArv: [0]
    });

    // 🔥 FLOORS GENERATION LOGIC
    this.propertyForm.get('noOfFloors')?.valueChanges.subscribe((count: number) => {
      this.generateFloors(count);
    });

    // 🔥 EMPTY PLOT LOGIC
    this.propertyForm.get('isPlotEmpty')?.valueChanges.subscribe(val => {
      if (val) {
        this.clearFloors();
        this.propertyForm.patchValue({ noOfFloors: 0 });
      }
    });

  }

  // ✅ Getter
  get floorsArray(): FormArray {
    return this.propertyForm.get('floors') as FormArray;
  }

  // ✅ Create Floor
  createFloor(): FormGroup {
    return this.fb.group({
      floorNo: [''],
      usageType: [''],
          propertyType: [''],   // 👈 ADD
      occupancy: [''],
      isRented:[false],
   
       expanded: [false] 
    });
  }

  // ✅ Generate Floors
  generateFloors(count: number) {
    this.floorsArray.clear();

    for (let i = 0; i < count; i++) {
      const floor = this.createFloor();
      floor.patchValue({ floorNo: i + 1 });
      this.floorsArray.push(floor);
    }
  }

  // ✅ Clear Floors
  clearFloors() {
    this.floorsArray.clear();
  }

  // ---------------- STEP LOGIC ----------------

  @Output() close = new EventEmitter();
  heading: any;
  step = 1;

  closeModal() {
    this.close.emit();
  }

  nextStep(){
    if(this.step < 2){   // 👈 now only 2 steps
      this.step++;
      this.setHeading();
    }
  }

  prevStep(){
    if(this.step > 1){
      this.step--;
      this.setHeading();
    }
  }

  setHeading(){
    switch(this.step){
      case 1:
        this.heading = 'Basic Property Details';
        break;

      case 2:
        this.heading = 'Additional Property Details';
        break;
    }
  }

  submit(){
    console.log(this.propertyForm.value);

    this.service.createPropety(this.propertyForm.value).subscribe({
      next:(res:any)=>{
        console.log(res);
      }
    });
  }

}