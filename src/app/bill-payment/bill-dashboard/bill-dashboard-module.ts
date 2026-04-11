import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BillPaymentComponent } from './bill-payment/bill-payment.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { ClickOutsideDirective } from 'src/app/directive/click-outside';
import { ErrorAlertComponent } from 'src/app/shared/ui/error-alert/error-alert.component';
import { IconsModule } from 'src/icons/icons-module';
import { BillDashboardComponent } from './bill-dashboard/bill-dashboard.component';

const routes: any = [
  {
    path: '',
    component: BillDashboardComponent,
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    BillDashboardComponent,
    BillPaymentComponent,
    AgGridModule,
    IconsModule,
    ClickOutsideDirective,
    FormsModule,
    ReactiveFormsModule,
    ErrorAlertComponent,
  ],
})
export class BillDashboardModule {}
