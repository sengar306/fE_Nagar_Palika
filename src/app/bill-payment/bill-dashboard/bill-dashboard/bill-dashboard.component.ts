import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { AgGridModule } from 'ag-grid-angular';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { ClickOutsideDirective } from 'src/app/directive/click-outside';
import { ErrorAlertComponent } from 'src/app/shared/ui/error-alert/error-alert.component';
import { IconsModule } from 'src/icons/icons-module';
import { BillService } from '../bill-service';
import { BillPaymentComponent } from '../bill-payment/bill-payment.component';

ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-bill-dashboard',
  standalone: true,
  templateUrl: './bill-dashboard.component.html',
  styleUrls: ['./bill-dashboard.component.scss'],
  imports: [
    CommonModule,
    AgGridModule,
    FormsModule,
    BillPaymentComponent,
    ReactiveFormsModule,
    ClickOutsideDirective,
    ErrorAlertComponent,
    IconsModule,
  ],
})
export class BillDashboardComponent implements OnInit {
  private billPaymentComponent?: BillPaymentComponent;
  shouldLoadBillPayment = false;
  private pendingOpenPaymentModal = false;

  @ViewChild(BillPaymentComponent)
  set billPaymentComponentRef(component: BillPaymentComponent | undefined) {
    this.billPaymentComponent = component;

    if (component && this.pendingOpenPaymentModal) {
      this.pendingOpenPaymentModal = false;
      queueMicrotask(() => component.openPaymentModal());
    }
  }
  allBills: any[] = [];

  rowData = [...this.allBills];
  searchControl = new FormControl('');
  errorMessage = '';
  successMessage = '';

  gridApi: any;
  columnApi: any;

  showColumnDropdown = false;
  showActionMenu = false;
  selectedStatus = '';
  isPaymentModalOpen = false;
  selectedBill: any = null;
  readonly paymentModeOptions = ['SPECIFIC_TAX', 'CURRENT_YEAR', 'ALL_BILLS'];
  readonly taxTypeOptions = ['HOUSE', 'WATER', 'SEWER'];

  paymentForm = new FormGroup({
    billNo: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    propertyId: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    paymentMode: new FormControl('CURRENT_YEAR', { nonNullable: true, validators: [Validators.required] }),
    taxType: new FormControl('HOUSE', { nonNullable: true }),
    amount: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    year: new FormControl('', { nonNullable: true }),
  });

  colDefs: any[] = [
    { headerName: 'Bill No', field: 'billNo' },
    { headerName: 'PTIN', field: 'ptin' },
    { headerName: 'Owner Name', field: 'ownerName' },
    { headerName: 'Ward', field: 'wardName' },
    { headerName: 'Locality', field: 'localityName' },
    { headerName: 'Bill Year', field: 'billYear' },
    { headerName: 'Generated Date', field: 'generatedDate' },
    { headerName: 'Amount', field: 'amount' },
    { headerName: 'Status', field: 'status' },
  ];

  constructor(private billService: BillService) {}

  ngOnInit() {
    this.getAllBills();
    this.updatePaymentFormValidators();

    this.searchControl.valueChanges.pipe(debounceTime(300), distinctUntilChanged()).subscribe(() => this.applyFilters());

    this.paymentForm.controls.paymentMode.valueChanges.subscribe(() => {
      this.updatePaymentFormValidators();
      this.patchPaymentFormForMode();
    });
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;
    this.updateGridState();
  }

  onRowClicked(event: any) {
    this.selectedBill = event?.data || null;
  }

  applyFilters() {
    const searchValue = this.searchControl.value?.toString().trim().toLowerCase() || '';

    this.rowData = this.allBills.filter((bill) => {
      const matchesStatus = !this.selectedStatus || bill.status === this.selectedStatus;
      const matchesSearch =
        !searchValue ||
        (bill.billNo || '').toLowerCase().includes(searchValue) ||
        (bill.ptin || '').toLowerCase().includes(searchValue) ||
        (bill.ownerName || '').toLowerCase().includes(searchValue) ||
        (bill.localityName || '').toLowerCase().includes(searchValue);

      return matchesStatus && matchesSearch;
    });

    this.updateGridState();
  }

  updateGridState() {
    if (!this.gridApi) {
      return;
    }

    if (this.rowData.length) {
      this.gridApi.hideOverlay();
      return;
    }

    this.gridApi.showNoRowsOverlay();
  }

  filterStatus(event: Event) {
    this.selectedStatus = (event.target as HTMLSelectElement).value || '';
    this.applyFilters();
  }

  resetFilters() {
    this.selectedStatus = '';
    this.searchControl.setValue('', { emitEvent: false });
    this.rowData = [...this.allBills];
    this.successMessage = '';
    this.updateGridState();
  }

  toggleColumnMenu() {
    this.showColumnDropdown = !this.showColumnDropdown;
    this.showActionMenu = false;
  }

  toggleActionMenu() {
    this.showActionMenu = !this.showActionMenu;
    this.showColumnDropdown = false;
  }

  closeMenus() {
    this.showColumnDropdown = false;
    this.showActionMenu = false;
  }

  getAllBills() {
    this.errorMessage = '';

    this.billService.getAllBills().subscribe({
      next: (response: any) => {
        const payload = response?.body;
        const billList = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.data)
            ? payload.data
            : Array.isArray(payload?.content)
              ? payload.content
              : Array.isArray(payload?.bills)
                ? payload.bills
                : [];

        this.allBills = billList.map((bill: any) => this.normalizeBill(bill));
        this.selectedBill = null;
        this.applyFilters();
      },
      error: (error: any) => {
        this.allBills = [];
        this.rowData = [];
        this.errorMessage = error?.error?.message || error?.message || 'Unable to load bills right now. Please try again.';
        this.updateGridState();
      },
    });
  }

  openPaymentModal() {
    this.showActionMenu = false;

    if (this.billPaymentComponent) {
      this.billPaymentComponent.openPaymentModal();
      return;
    }

    this.pendingOpenPaymentModal = true;
    this.shouldLoadBillPayment = true;
  }

  closePaymentModal() {
    this.isPaymentModalOpen = false;
    this.paymentForm.markAsPristine();
    this.paymentForm.markAsUntouched();
  }

  submitCounterPayment() {
    if (this.paymentForm.invalid) {
      this.paymentForm.markAllAsTouched();
      return;
    }

    const formValue = this.paymentForm.getRawValue();
    const bill = this.allBills.find((item) => item.billNo === formValue.billNo);

    if (!bill) {
      this.errorMessage = 'Selected bill was not found. Please choose a valid bill and try again.';
      return;
    }

    const requestBody = {
      propertyId: Number(formValue.propertyId),
      taxType: this.isSpecificTaxMode ? formValue.taxType : null,
      amount: this.requiresAmount ? Number(formValue.amount) : bill.amount,
      year: this.requiresYear ? Number(formValue.year) : null,
      paymentMode: formValue.paymentMode,
    };

    bill.status = 'Paid';
    this.selectedBill = bill;
    this.successMessage = `Bill payment request ready for ${bill.billNo}: ${JSON.stringify(requestBody)}`;
    this.applyFilters();
    this.closePaymentModal();
  }

  onBillSelectionChange(event: Event) {
    const billNo = (event.target as HTMLSelectElement).value;
    const selectedBill = this.allBills.find((bill) => bill.billNo === billNo) || null;
    this.patchPaymentForm(selectedBill);
  }

  onPropertySelectionChange(event: Event) {
    const propertyId = (event.target as HTMLSelectElement).value;
    const selectedBill =
      this.allBills.find((bill) => String(bill.propertyId) === propertyId && bill.status !== 'Paid') ||
      this.allBills.find((bill) => String(bill.propertyId) === propertyId) ||
      null;

    this.patchPaymentForm(selectedBill);
  }

  toggleColumn(col: any) {
    const id = col.colId || col.field;
    const column = this.gridApi?.getColumn(id);

    if (!column) {
      return;
    }

    this.gridApi.setColumnsVisible([id], !column.isVisible());
  }

  isColumnVisible(col: any) {
    const id = col.colId || col.field;
    const column = this.gridApi?.getColumn(id);
    return column ? column.isVisible() : true;
  }

  get isSpecificTaxMode() {
    return this.paymentForm.controls.paymentMode.value === 'SPECIFIC_TAX';
  }

  get requiresAmount() {
    return this.paymentForm.controls.paymentMode.value !== 'ALL_BILLS';
  }

  get requiresYear() {
    return this.paymentForm.controls.paymentMode.value === 'SPECIFIC_TAX';
  }

  get propertyOptions() {
    const unique = new Map<string, { propertyId: string; ownerName: string; ptin: string }>();

    for (const bill of this.allBills) {
      const propertyId = String(bill?.propertyId || '');

      if (!propertyId || unique.has(propertyId)) {
        continue;
      }

      unique.set(propertyId, {
        propertyId,
        ownerName: bill?.ownerName || '',
        ptin: bill?.ptin || '',
      });
    }

    return Array.from(unique.values());
  }

  private patchPaymentForm(bill: any) {
    this.selectedBill = bill;

    this.paymentForm.patchValue({
      billNo: bill?.billNo || '',
      propertyId: bill?.propertyId?.toString() || '',
      paymentMode: 'CURRENT_YEAR',
      taxType: 'HOUSE',
      amount: bill?.amount?.toString() || '',
      year: bill?.billYear?.toString() || '',
    });

    this.updatePaymentFormValidators();
  }

  private patchPaymentFormForMode() {
    const bill = this.selectedBill;

    if (!bill) {
      return;
    }

    if (this.paymentForm.controls.paymentMode.value === 'ALL_BILLS') {
      this.paymentForm.patchValue({
        amount: '',
        year: '',
      });
      return;
    }

    this.paymentForm.patchValue({
      amount: bill?.amount?.toString() || '',
      year: this.paymentForm.controls.paymentMode.value === 'SPECIFIC_TAX' ? bill?.billYear?.toString() || '' : '',
    });
  }

  private updatePaymentFormValidators() {
    const amountControl = this.paymentForm.controls.amount;
    const yearControl = this.paymentForm.controls.year;
    const taxTypeControl = this.paymentForm.controls.taxType;

    amountControl.clearValidators();
    yearControl.clearValidators();
    taxTypeControl.clearValidators();

    if (this.requiresAmount) {
      amountControl.addValidators([Validators.required]);
    }

    if (this.requiresYear) {
      yearControl.addValidators([Validators.required]);
      taxTypeControl.addValidators([Validators.required]);
    }

    amountControl.updateValueAndValidity({ emitEvent: false });
    yearControl.updateValueAndValidity({ emitEvent: false });
    taxTypeControl.updateValueAndValidity({ emitEvent: false });
  }

  private normalizeBill(bill: any) {
    const property = bill?.property || {};
    const owner = property?.ownerName || property?.owner || bill?.ownerName || bill?.payerName || '';
    const ward = property?.ward?.name || property?.wardName || bill?.wardName || '';
    const locality = property?.locality?.name || property?.localityName || bill?.localityName || '';
    const amount =
      bill?.amount ??
      bill?.totalTax ??
      bill?.billAmount ??
      bill?.totalAmount ??
      property?.totalTax ??
      property?.outstandingTax ??
      0;
    const paidStatus = typeof bill?.paid === 'boolean' ? (bill.paid ? 'Paid' : 'Unpaid') : '';
    const status = bill?.status || bill?.billStatus || paidStatus || 'Unpaid';
    const generatedDate = bill?.generatedDate || bill?.billDate || property?.lastBillDate || '';
    const derivedYear = bill?.year && Number(bill.year) > 0 ? String(bill.year) : generatedDate ? String(generatedDate).slice(0, 4) : '';
    const billYear = bill?.billYear || bill?.financialYear || derivedYear;
    const billNo = bill?.billNo || bill?.billNumber || bill?.id || '';
    const ptin = property?.ptin || bill?.ptin || bill?.propertyPtin || property?.id || '';

    return {
      ...bill,
      billNo: String(billNo),
      propertyId: String(property?.id || bill?.propertyId || ''),
      ptin: String(ptin),
      ownerName: String(owner),
      wardName: String(ward),
      localityName: String(locality),
      billYear: String(billYear),
      generatedDate: String(generatedDate),
      amount: Number(amount) || 0,
      status: String(status),
    };
  }
}
