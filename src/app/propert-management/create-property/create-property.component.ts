import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BasicPropertyDetailsComponent } from './basic-property-details/basic-property-details.component';
import { AdditionalParametersComponent } from './additional-parameters/additional-parameters.component';
import { PropertyManagemnetService } from '../property-managemnet-service';
import { ErrorAlertComponent } from 'src/app/shared/ui/error-alert/error-alert.component';
import { ErrorMessageService } from 'src/app/shared/services/error-message.service';

@Component({
  selector: 'app-create-property',
  templateUrl: './create-property.component.html',
  styleUrls: ['./create-property.component.scss'],
  imports: [
    CommonModule,
    BasicPropertyDetailsComponent,
    AdditionalParametersComponent,
    ReactiveFormsModule,
    ErrorAlertComponent,
  ],
})
export class CreatePropertyComponent implements OnInit {
  @Output() close = new EventEmitter<void>();

  propertyForm!: FormGroup;
  heading: any;
  step = 1;
  submitError = '';

  constructor(
    private fb: FormBuilder,
    private service: PropertyManagemnetService,
    private errorMessageService: ErrorMessageService
  ) {}

  ngOnInit(): void {
    this.setHeading();

    this.propertyForm = this.fb.group({
      propertyType: [null],
      zone: [null],
      ward: [null],
      locality: [null],
      ptin: [''],
      image: [''],
      ownership: [''],
      ownerName: [''],
      fatherName: [''],
      mobileNo: [''],
      latitude: [''],
      longitude: [''],
      gender: [''],
      isPlotEmpty: [false],
      totalPlotArea: [''],
      totalResidentialArea: [''],
      totalCommercialArea: [''],
      noOfFloors: [0],
      houseNo: [''],
      oldHouseNo: [''],
      propertySequenceNo: [''],
      propertyTypeId: [null],
      propertyCategoryId: [null],
      arvResidential: [0],
      arvCommercial: [0],
      arvEffectiveFrom: [null],
      floors: this.fb.array([]),
      houseAge: [''],
      wardName: [''],
      sequenceNo: [null],
      streetNo: [null],
      roadWidth: [''],
      streetName: [''],
      plotArea: [''],
      builtType: [''],
      isRented: [false],
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
      proposedArv: [0],
    });

    this.propertyForm.get('noOfFloors')?.valueChanges.subscribe((count: number) => {
      this.generateFloors(count);
    });

    this.floorsArray.valueChanges.subscribe(() => {
      this.updateAreaTotals();
    });

    this.propertyForm.get('isPlotEmpty')?.valueChanges.subscribe((val) => {
      if (val) {
        this.clearFloors();
        this.propertyForm.patchValue({ noOfFloors: 0 });
        this.updateAreaTotals();
      }
    });
  }

  get floorsArray(): FormArray {
    return this.propertyForm.get('floors') as FormArray;
  }

  createFloor(): FormGroup {
    return this.fb.group({
      floorNo: [''],
      totalArea: [''],
      usageType: [''],
      propertyType: [''],
      occupancy: [''],
      rentedArea: [''],
      isRented: [false],
      expanded: [false],
    });
  }

  generateFloors(count: number) {
    this.floorsArray.clear();

    for (let i = 0; i < count; i++) {
      const floor = this.createFloor();
      floor.patchValue({ floorNo: i + 1 });
      this.floorsArray.push(floor);
    }

    this.updateAreaTotals();
  }

  clearFloors() {
    this.floorsArray.clear();
    this.updateAreaTotals();
  }

  updateAreaTotals() {
    let totalResidentialArea = 0;
    let totalCommercialArea = 0;

    this.floorsArray.controls.forEach((floor) => {
      const type = floor.get('propertyType')?.value;
      const totalArea = Number(floor.get('totalArea')?.value) || 0;

      if (type === 'Residential') {
        totalResidentialArea += totalArea;
      }

      if (type === 'Commercial') {
        totalCommercialArea += totalArea;
      }
    });

    this.propertyForm.patchValue(
      {
        totalResidentialArea,
        totalCommercialArea,
      },
      { emitEvent: false }
    );
  }

  closeModal() {
    this.close.emit();
  }

  nextStep() {
    if (this.step < 2) {
      this.step++;
      this.setHeading();
    }
  }

  prevStep() {
    if (this.step > 1) {
      this.step--;
      this.setHeading();
    }
  }

  clearForm() {
    this.propertyForm.reset({
      noOfFloors: 0,
      arvResidential: 0,
      arvCommercial: 0,
      houseTax: false,
      waterTax: false,
      sewerTax: false,
      deactivateOldProperty: false,
      arrearHouseTax: 0,
      arrearWaterTax: 0,
      arrearSewerTax: 0,
      surchargeHouseTax: 0,
      surchargeWaterTax: 0,
      surchargeSewerTax: 0,
      proposedArv: 0,
      isPlotEmpty: false,
      isRented: false,
    });
    this.clearFloors();
    this.submitError = '';
    this.step = 1;
    this.setHeading();
  }

  setHeading() {
    switch (this.step) {
      case 1:
        this.heading = 'Basic Property Details';
        break;
      case 2:
        this.heading = 'Additional Property Details';
        break;
    }
  }

  submit() {
    this.submitError = '';

    this.service.createPropety(this.propertyForm.value).subscribe({
      next: () => {
        this.close.emit();
      },
      error: (err) => {
        this.submitError = this.errorMessageService.getMessage(
          err,
          'Property save nahi ho paayi.'
        );
      },
    });
  }
}
