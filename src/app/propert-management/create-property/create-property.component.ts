import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BasicPropertyDetailsComponent } from './basic-property-details/basic-property-details.component';
import { AdditionalParametersComponent } from './additional-parameters/additional-parameters.component';
import { PropertyManagemnetService } from '../property-managemnet-service';
import { ErrorAlertComponent } from 'src/app/shared/ui/error-alert/error-alert.component';
import { ErrorMessageService } from 'src/app/shared/services/error-message.service';
import { concatMap, finalize, of, tap } from 'rxjs';

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
  isSubmitting = false;
  showSuccess = false;
  createdPropertyId: number | string | null = null;
  createdPtin = '';

  constructor(
    private fb: FormBuilder,
    private service: PropertyManagemnetService,
    private errorMessageService: ErrorMessageService,
    private router: Router
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
  
  
   let floor=this.fb.group({
      floorNo: [''],
      builtUpArea: [''],
      emptyArea:[''],
      constructionType: [this.propertyForm.get('builtType')?.value],
      category: [''],
      occupancy: [''],
      rentedArea: [''],
      isRented: [false],
      expanded: [false],
    });
    
  if(this.propertyForm.get('propertyType')?.value!='Mixed'){
     floor.get('category')?.patchValue(this.propertyForm.get('propertyType')?.value)
    }
   
    return floor;
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
    this.showSuccess = false;
    this.createdPropertyId = null;
    this.createdPtin = '';
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
      case 3:
        this.heading = 'Property Created Successfully';
        break;
    }
  }
  get createdPropertyLabel(): string {
    if (this.createdPtin) {
      return this.createdPtin;
    }

    if (this.createdPropertyId !== null && this.createdPropertyId !== undefined) {
      return String(this.createdPropertyId);
    }

    return '-';
  }

  get canOpenCreatedProperty(): boolean {
    return this.createdPropertyId !== null && this.createdPropertyId !== undefined && this.createdPropertyId !== '';
  }

  private extractCreatedProperty(response: any): any {
    return response?.body || response?.data || response || null;
  }

  openCreatedProperty() {
    if (!this.canOpenCreatedProperty) {
      return;
    }

    this.close.emit();
    this.router.navigate(['home/property', this.createdPropertyId]);
  }

  submit() {
    if (this.isSubmitting) {
      return;
    }

    this.submitError = '';
    this.isSubmitting = true;

    let createdProperty: any;

    this.service
      .createPropety(this.propertyForm.value)
      .pipe(
        tap((response: any) => {
          createdProperty = this.extractCreatedProperty(response);
        }),
        concatMap(() => {
          const propertyId = createdProperty?.id;
          if (!propertyId) {
            return of(null);
          }

          return this.service.createBill(propertyId);
        }),
        finalize(() => {
          this.isSubmitting = false;
        })
      )
      .subscribe({
        next: () => {
          if (!createdProperty?.id) {
            this.submitError = 'Property saved but ID was not returned. Please check the property list.';
            return;
          }

          this.createdPropertyId = createdProperty.id;
          this.createdPtin = createdProperty.ptin || '';
          this.showSuccess = true;
          this.step = 3;
          this.setHeading();
        },
        error: (err) => {
          this.submitError = this.errorMessageService.getMessage(
            err,
            'The property or billing could not be saved.'
          );
        },
      });
  }
}
