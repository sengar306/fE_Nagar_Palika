import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { AgGridModule } from 'ag-grid-angular';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { CreatePropertyComponent } from './create-property/create-property.component';
import { PropertyManagemnetService } from './property-managemnet-service';
import { IconsModule } from 'src/icons/icons-module';
import { ClickOutsideDirective } from '../directive/click-outside';
import { ErrorAlertComponent } from '../shared/ui/error-alert/error-alert.component';
import { ErrorMessageService } from '../shared/services/error-message.service';
import { FeatherModule } from 'angular-feather';

ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-propert-management',
  templateUrl: './propert-management.component.html',
  styleUrls: ['./propert-management.component.scss'],
  imports: [
    CreatePropertyComponent,
    CommonModule,
    AgGridModule,
    IconsModule,
    ClickOutsideDirective,
    FormsModule,
    ReactiveFormsModule,
    ErrorAlertComponent,
  ],
})
export class PropertManagementComponent implements OnInit {
  zones: any[] = [];
  wards: any[] = [];
  localities: any[] = [];
  rowData: any[] = [];
  searchControl = new FormControl('');
  errorMessage = '';

  gridApi: any;
  columnApi: any;

  isModal = false;
  showColumnDropdown = false;
  showActionMenu = false;
  showFilterPopup = false;

  selectedZoneId: any;
  selectedWardId: any;
  selectedLocalityId: any;

  constructor(
    private service: PropertyManagemnetService,
    private router: Router,
    private errorMessageService: ErrorMessageService
  ) {}

  ngOnInit() {
    this.getAllProperty();
    this.loadZones();

    this.searchControl.valueChanges
      .pipe(debounceTime(350), distinctUntilChanged())
      .subscribe(() => this.getAllProperty());
  }

  colDefs = [
    { headerName: 'Zone Name', field: 'zone.name', hide: true },
    { headerName: 'Ward Name', field: 'ward.name' },
    { headerName: 'Locality', field: 'locality.name' },
    { headerName: 'PTIN', field: 'ptin' },
    { headerName: 'Ownership', field: 'ownership' },
    { headerName: 'Owner Name', field: 'ownerName', hide: true },
    { headerName: 'Father Name', field: 'fatherName', hide: true },
    { headerName: 'Mobile No', field: 'mobileNo', hide: true },
    { headerName: 'Gender', field: 'gender', hide: true },
    { headerName: 'House No', field: 'houseNo' },
    { headerName: 'Old House No', field: 'oldHouseNo' },
    { headerName: 'Property Sequence No', field: 'propertySequenceNo' },
    { headerName: 'Property Type ID', field: 'propertyTypeId' },
    { headerName: 'Property Category ID', field: 'propertyCategoryId' },
    { headerName: 'ARV Residential', field: 'arvResidential' },
    { headerName: 'ARV Commercial', field: 'arvCommercial' },
    { headerName: 'ARV Effective From', field: 'arvEffectiveFrom' },
    { headerName: 'House Tax', field: 'houseTax' },
    { headerName: 'Water Tax', field: 'waterTax' },
    { headerName: 'Sewer Tax', field: 'sewerTax' },
    { headerName: 'Deactivate Old Property', field: 'deactivateOldProperty' },
    { headerName: 'Arrear House Tax', field: 'arrearHouseTax' },
    { headerName: 'Arrear Water Tax', field: 'arrearWaterTax' },
    { headerName: 'Arrear Sewer Tax', field: 'arrearSewerTax' },
    { headerName: 'Surcharge House Tax', field: 'surchargeHouseTax' },
    { headerName: 'Surcharge Water Tax', field: 'surchargeWaterTax' },
    { headerName: 'Surcharge Sewer Tax', field: 'surchargeSewerTax' },
    { headerName: 'Proposed ARV', field: 'proposedArv' },
  ];

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;
    this.updateGridState();
  }

  getAllProperty() {
    const params: any = {};
    const searchValue = this.searchControl.value?.toString().trim();

    if (this.selectedZoneId) {
      params.zoneId = this.selectedZoneId;
    }

    if (this.selectedWardId) {
      params.wardId = this.selectedWardId;
    }

    if (this.selectedLocalityId) {
      params.localityId = this.selectedLocalityId;
    }

    if (searchValue) {
      params.search = searchValue;
    }

    this.errorMessage = '';
    this.gridApi?.showLoadingOverlay();

    this.service.getAllProperty(params).subscribe({
      next: (res: any) => {
        this.rowData = Array.isArray(res?.body) ? res.body : [];
        this.updateGridState();
      },
      error: (err) => {
        this.rowData = [];
        this.errorMessage = this.errorMessageService.getMessage(
          err,
          'The property list could not be loaded.'
        );
        this.updateGridState();
      },
    });
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

  loadZones() {
    this.service.getZones().subscribe({
      next: (res: any) => {
        this.zones = Array.isArray(res?.body) ? res.body : [];
      },
      error: () => {
        this.zones = [];
      },
    });
  }

  loadWards(zoneId: number) {
    this.service.getWard(zoneId).subscribe({
      next: (res: any) => {
        this.wards = Array.isArray(res?.body) ? res.body : [];
        this.localities = [];
      },
      error: () => {
        this.wards = [];
        this.localities = [];
      },
    });
  }

  loadLocalities(wardId: number) {
    this.service.getLocality(wardId).subscribe({
      next: (res: any) => {
        this.localities = Array.isArray(res?.body) ? res.body : [];
      },
      error: () => {
        this.localities = [];
      },
    });
  }

  filterZone(event: Event) {
    this.selectedZoneId = (event.target as HTMLSelectElement).value || null;
    this.selectedWardId = null;
    this.selectedLocalityId = null;
    this.wards = [];
    this.localities = [];

    if (this.selectedZoneId) {
      this.loadWards(this.selectedZoneId);
    }

    this.getAllProperty();
  }

  filterWard(event: Event) {
    this.selectedWardId = (event.target as HTMLSelectElement).value || null;
    this.selectedLocalityId = null;
    this.localities = [];

    if (this.selectedWardId) {
      this.loadLocalities(this.selectedWardId);
    }

    this.getAllProperty();
  }

  filterLocality(event: Event) {
    this.selectedLocalityId = (event.target as HTMLSelectElement).value || null;
    this.getAllProperty();
  }

  resetFilters() {
    this.selectedZoneId = null;
    this.selectedWardId = null;
    this.selectedLocalityId = null;
    this.wards = [];
    this.localities = [];
    this.searchControl.setValue('');
    this.getAllProperty();
  }

  openModal() {
    this.isModal = true;
    this.closeMenus();
  }

  closeModal() {
    this.isModal = false;
    this.getAllProperty();
  }

  toggleColumnMenu() {
    this.showColumnDropdown = !this.showColumnDropdown;
    this.showActionMenu = false;
    this.showFilterPopup = false;
  }

  toggleActionMenu() {
    this.showActionMenu = !this.showActionMenu;
    this.showColumnDropdown = false;
    this.showFilterPopup = false;
  }

  closeMenus() {
    this.showColumnDropdown = false;
    this.showActionMenu = false;
    this.showFilterPopup = false;
  }

  toggleColumn(col: any) {
    const id = col.colId || col.field;
    const column = this.gridApi.getColumn(id);

    if (!column) {
      return;
    }

    const visible = column.isVisible();
    this.gridApi.setColumnsVisible([id], !visible);
  }

  isColumnVisible(col: any) {
    const id = col.colId || col.field;
    const column = this.gridApi?.getColumn(id);
    return column ? column.isVisible() : true;
  }

  toggleFilterPopup() {
    this.showFilterPopup = !this.showFilterPopup;
    this.showActionMenu = false;
    this.showColumnDropdown = false;
  }

  onRowClicked(event: any) {
    this.router.navigate(['home/property', event.data.id]);
  }
}
