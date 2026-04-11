import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BasicPropertyDetailsComponent } from './basic-property-details/basic-property-details.component';
import { AdditionalParametersComponent } from './additional-parameters/additional-parameters.component';
import { PropertyManagemnetService } from '../property-managemnet-service';
import { ErrorAlertComponent } from 'src/app/shared/ui/error-alert/error-alert.component';
import { ErrorMessageService } from 'src/app/shared/services/error-message.service';
import { concatMap, finalize, of, tap } from 'rxjs';
import { AuthService } from 'src/app/auth/service/auth-service';

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
export class CreatePropertyComponent implements OnInit, OnChanges {
  @Output() close = new EventEmitter<void>();
  @Input() propertyToEdit: any = null;

  propertyForm!: FormGroup;
  heading: any;
  step = 1;
  submitError = '';
  isSubmitting = false;
  showSuccess = false;
  createdPropertyId: number | string | null = null;
  createdPtin = '';
  editingPropertyId: number | string | null = null;
  private editMode = false;

  constructor(
    private fb: FormBuilder,
    private service: PropertyManagemnetService,
    private errorMessageService: ErrorMessageService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.applyEditState();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['propertyToEdit'] && this.propertyForm) {
      this.applyEditState();
    }
  }

  private initializeForm() {
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

  private applyEditState() {
    this.clearFormState();
    this.editingPropertyId = this.propertyToEdit?.id ?? null;
    this.editMode = !!this.editingPropertyId;

    if (this.editMode && this.propertyToEdit) {
      this.populateFormForEdit(this.propertyToEdit);
    }

    this.setHeading();
  }

  private clearFormState() {
    this.submitError = '';
    this.showSuccess = false;
    this.createdPropertyId = null;
    this.createdPtin = '';
    this.step = 1;
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
    this.editingPropertyId = null;
    this.editMode = false;
    this.clearFormState();
    this.setHeading();
  }

  setHeading() {
    switch (this.step) {
      case 1:
        this.heading = this.isEditMode ? 'Update Property Details' : 'Basic Property Details';
        break;
      case 2:
        this.heading = this.isEditMode ? 'Update Additional Details' : 'Additional Property Details';
        break;
      case 3:
        this.heading = this.isEditMode ? 'Property Updated Successfully' : 'Property Created Successfully';
        break;
    }
  }
  get isEditMode(): boolean {
    return this.editMode;
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

  private buildCreatePayload() {
    const tokenData: any = this.authService.getTokendata() || {};
    const createdBy =
      tokenData?.name ||
      tokenData?.username ||
      tokenData?.userName ||
      tokenData?.email ||
      'system';

    return {
      ...this.propertyForm.value,
      createdBy,
      createdAt: new Date().toISOString(),
    };
  }

  private buildUpdatePayload() {
    const tokenData: any = this.authService.getTokendata() || {};
    const updatedBy =
      tokenData?.name ||
      tokenData?.username ||
      tokenData?.userName ||
      tokenData?.email ||
      'system';

    return {
      ...this.propertyForm.value,
      updatedBy,
      updatedAt: new Date().toISOString(),
    };
  }

  private populateFormForEdit(property: any) {
    this.propertyForm.patchValue(
      {
        propertyType: property?.propertyType?.name || property?.propertyType || null,
        zone: property?.zone || null,
        ward: property?.ward || null,
        locality: property?.locality || null,
        ptin: property?.ptin || '',
        image: property?.image || '',
        ownership: property?.ownership || '',
        ownerName: property?.ownerName || '',
        fatherName: property?.fatherName || '',
        mobileNo: property?.mobileNo || '',
        latitude: property?.latitude || '',
        longitude: property?.longitude || '',
        gender: property?.gender || '',
        isPlotEmpty: !!property?.isPlotEmpty,
        totalPlotArea: property?.totalPlotArea || '',
        totalResidentialArea: property?.totalResidentialArea || '',
        totalCommercialArea: property?.totalCommercialArea || '',
        noOfFloors: property?.noOfFloors || 0,
        houseNo: property?.houseNo || '',
        oldHouseNo: property?.oldHouseNo || '',
        propertySequenceNo: property?.propertySequenceNo || '',
        propertyTypeId: property?.propertyTypeId ?? null,
        propertyCategoryId: property?.propertyCategoryId ?? null,
        arvResidential: property?.arvResidential || 0,
        arvCommercial: property?.arvCommercial || 0,
        arvEffectiveFrom: property?.arvEffectiveFrom || null,
        houseAge: property?.houseAge || '',
        wardName: property?.wardName || '',
        sequenceNo: property?.sequenceNo ?? null,
        streetNo: property?.streetNo ?? null,
        roadWidth: property?.roadWidth || null,
        streetName: property?.streetName || '',
        plotArea: property?.plotArea || '',
        builtType: property?.builtType || '',
        isRented: !!property?.isRented,
        houseTax: !!property?.houseTax,
        waterTax: !!property?.waterTax,
        sewerTax: !!property?.sewerTax,
        deactivateOldProperty: !!property?.deactivateOldProperty,
        arrearHouseTax: property?.arrearHouseTax || 0,
        arrearWaterTax: property?.arrearWaterTax || 0,
        arrearSewerTax: property?.arrearSewerTax || 0,
        surchargeHouseTax: property?.surchargeHouseTax || 0,
        surchargeWaterTax: property?.surchargeWaterTax || 0,
        surchargeSewerTax: property?.surchargeSewerTax || 0,
        proposedArv: property?.proposedArv || 0,
      },
      { emitEvent: false }
    );

    this.floorsArray.clear();
    const floors = Array.isArray(property?.floors) ? property.floors : [];

    floors.forEach((floor: any, index: number) => {
      const floorGroup = this.createFloor();
      floorGroup.patchValue(
        {
          floorNo: floor?.floorNo ?? index + 1,
          builtUpArea: floor?.builtUpArea ?? '',
          emptyArea: floor?.emptyArea ?? '',
          constructionType: floor?.constructionType ?? property?.builtType ?? '',
          category: floor?.category || floor?.propertyType?.name || floor?.propertyType || '',
          occupancy: floor?.occupancy ?? '',
          rentedArea: floor?.rentedArea ?? '',
          isRented: floor?.isRented === true || floor?.isRented === 'yes',
          expanded: false,
        },
        { emitEvent: false }
      );
      this.floorsArray.push(floorGroup);
    });

    this.propertyForm.patchValue(
      { noOfFloors: floors.length || property?.noOfFloors || 0 },
      { emitEvent: false }
    );
    this.updateAreaTotals();
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

    const targetPropertyId = this.propertyToEdit?.id ?? this.editingPropertyId;

    const request$ = this.isEditMode && targetPropertyId
      ? this.service.updateProperty(targetPropertyId, this.buildUpdatePayload())
      : this.service.createPropety(this.buildCreatePayload()).pipe(
          tap((response: any) => {
            createdProperty = this.extractCreatedProperty(response);
          }),
          concatMap(() => {
            const propertyId = createdProperty?.id;
            if (!propertyId) {
              return of(null);
            }

            return this.service.createBill(propertyId);
          })
        );

    request$
      .pipe(
        finalize(() => {
          this.isSubmitting = false;
        })
      )
      .subscribe({
        next: (response: any) => {
          if (this.isEditMode) {
            const updatedProperty = this.extractCreatedProperty(response) || this.propertyToEdit || {};
            this.createdPropertyId = updatedProperty?.id || this.editingPropertyId;
            this.createdPtin = updatedProperty?.ptin || this.propertyForm.get('ptin')?.value || '';
            this.showSuccess = true;
            this.step = 3;
            this.setHeading();
            return;
          }

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
            this.isEditMode
              ? 'The property could not be updated.'
              : 'The property or billing could not be saved.'
          );
        },
      });
  }
}
