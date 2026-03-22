import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PropertyManagemnetService } from '../property-managemnet-service';
import { ErrorAlertComponent } from 'src/app/shared/ui/error-alert/error-alert.component';
import { ErrorMessageService } from 'src/app/shared/services/error-message.service';

@Component({
  selector: 'app-property-details',
  templateUrl: './property-details.component.html',
  styleUrls: ['./property-details.component.scss'],
  imports: [CommonModule, ErrorAlertComponent],
})
export class PropertyDetailsComponent implements OnInit {
  selectesId!: any;
  data: any;
  errorMessage = '';

  constructor(
    private service: PropertyManagemnetService,
    private activatedRoute: ActivatedRoute,
    private errorMessageService: ErrorMessageService
  ) {}

  ngOnInit() {
    this.selectesId = this.activatedRoute.snapshot.paramMap.get('id');
    this.getDataById();
  }

  getDataById() {
    this.errorMessage = '';

    this.service.getPropetyById(this.selectesId).subscribe({
      next: (res: any) => {
        this.data = res?.body;
      },
      error: (err) => {
        this.data = null;
        this.errorMessage = this.errorMessageService.getMessage(
          err,
          'Property details could not be loaded.'
        );
      },
    });
  }

  getStatusLabel(value: unknown): string {
    return value ? 'Yes' : 'No';
  }

  getDisplayValue(value: unknown, fallback = '-'): string | number {
    return value === null || value === undefined || value === '' ? fallback : (value as string | number);
  }

  getRoadWidthLabel(): string {
    return this.data?.roadWidth?.width || this.data?.roadWidth?.name || '-';
  }

  getPropertyTypeLabel(): string {
    return (
      this.data?.propertyType?.name ||
      this.data?.propertyType?.type ||
      this.data?.propertyType ||
      '-'
    );
  }

  getFloorLabel(floor: any): string {
    return (
      floor?.category ||
      floor?.propertyType?.name ||
      floor?.propertyType ||
      '-'
    );
  }

  getFloorArea(floor: any): string | number {
    return floor?.builtUpArea ?? floor?.totalArea ?? 0;
  }
}
