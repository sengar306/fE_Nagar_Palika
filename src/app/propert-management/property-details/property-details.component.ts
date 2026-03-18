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
          'Property details load nahi ho paaye.'
        );
      },
    });
  }
}
