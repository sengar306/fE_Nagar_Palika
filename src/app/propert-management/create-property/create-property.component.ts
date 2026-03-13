    import { Component, EventEmitter, OnInit, Output } from '@angular/core';
    import { BasicPropertyDetailsComponent } from './basic-property-details/basic-property-details.component';
    import { AdditionalParametersComponent } from './additional-parameters/additional-parameters.component';
    import { PropertyFloorDetailsComponent } from './property-floor-details/property-floor-details.component';
    import { AnnualCalculationComponent } from './annual-calculation/annual-calculation.component';
  import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
  import { CommonModule } from '@angular/common';
import { PropertyManagemnetService } from '../property-managemnet-service';

    @Component({
      selector: 'app-create-property',
      templateUrl: './create-property.component.html',
      styleUrls: ['./create-property.component.scss'],
      imports:[BasicPropertyDetailsComponent,AdditionalParametersComponent,PropertyFloorDetailsComponent,AnnualCalculationComponent,ReactiveFormsModule]
    })
    export class CreatePropertyComponent implements OnInit  {
      propertyForm:any
      constructor(private fb:FormBuilder,private service:PropertyManagemnetService){}
    ngOnInit(): void {
      
    this.setHeading()
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

  houseNo: [''],
  oldHouseNo: [''],
  propertySequenceNo: [''],

  propertyTypeId: [null],
  propertyCategoryId: [null],

  arvResidential: [0],
  arvCommercial: [0],
  arvEffectiveFrom: [null],
floors:this.fb.array([]),
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
    }
    @Output () close=new EventEmitter()
    heading:any
    closeModal() {
      this.close.emit()
    }
    step = 1;

    nextStep(){
      if(this.step <= 4){
        console.log(this.propertyForm.value)
        this.step++;
        this.setHeading()
      }
    }



    prevStep(){
      if(this.step > 1){
        this.step--;
          this.setHeading()
      }
    }
    setHeading(){

      switch(this.step){

        case 1:
          this.heading = 'Basic Property Details';
          break;

        case 2:
          this.heading = 'Property Related Details';
          break;



        case 3:
          this.heading = 'Property Arrear Details';
          break;

      }

    }
    submit(){
  this.service.createPropety(this.propertyForm.value).subscribe({
    next:(res:any)=>{
      console.log(res)
    }
  })
    }
    get totalSteps(): number {
  const pType = this.propertyForm.get('propertyType')?.value;
  // Agar Assessment hai to 4 steps, varna 3 steps
  return pType === 'Assessment' ? 4 : 3;
}
    }
