import { Component, OnInit } from '@angular/core';
import { CreatePropertyComponent } from "./create-property/create-property.component";
import { CommonModule } from '@angular/common';
import { PropertyManagemnetService } from './property-managemnet-service';
import { AgGridAngular, AgGridModule } from 'ag-grid-angular';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import { IconsModule } from 'src/icons/icons-module';
import { ClickOutsideDirective } from '../directive/click-outside';
import { FormControl, FormsModule } from '@angular/forms';
import { tap, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { Router } from '@angular/router';

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
    ClickOutsideDirective,FormsModule
  ],
})
export class PropertManagementComponent implements OnInit {

  constructor(private service: PropertyManagemnetService,private router:Router) {}

  zones: any[] = [];
  wards: any[] = [];
  localities: any[] = [];
    
searchControl = new FormControl();
loading = false;

  rowData: any;

  gridApi: any;
  columnApi: any;

  isModal = false;

  showColumnDropdown = false;
  showActionMenu = false;
  showFilterPopup = false;

  selectedZoneId: any;
  selectedWardId: any;
  selectedLocalityId: any;
  searchText: any;

  ngOnInit() {
    this.getAllProperty();
    this.loadZones();
      this.searchControl.valueChanges.pipe(

    tap(() => this.gridApi?.showLoadingOverlay()),

    debounceTime(500),

    distinctUntilChanged(),

    switchMap((value:any) => {

      const params:any = {}

      if(this.selectedZoneId){
        params.zoneId = this.selectedZoneId
      }

      if(this.selectedWardId){
        params.wardId = this.selectedWardId
      }

      if(this.selectedLocalityId){
        params.localityId = this.selectedLocalityId
      }

      if(value){
        params.search = value
      }

      return this.service.getAllProperty(params)

    })

  ).subscribe((res:any)=>{
      this.rowData = res.body
    this.gridApi?.hideOverlay()
  })
  }

  // AG GRID COLUMNS
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

  // GRID READY
  onGridReady(params: any) {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;
  }

  // GET PROPERTY WITH FILTER
  getAllProperty() {

    const params: any = {};

    if (this.selectedZoneId) {
      params.zoneId = this.selectedZoneId;
    }

    if (this.selectedWardId) {
      params.wardId = this.selectedWardId;
    }

    if (this.selectedLocalityId) {
      params.localityId = this.selectedLocalityId;
    }

    if (this.searchText) {
      params.search = this.searchText;
    }

    this.service.getAllProperty(params).subscribe({
      next: (res: any) => {
        this.rowData = res.body;
      }
    });

  }

  // LOAD ZONES
  loadZones() {
    this.service.getZones().subscribe((res: any) => {
      this.zones = res.body;
    });
  }

  // LOAD WARDS
  loadWards(zoneId: number) {
    this.service.getWard(zoneId).subscribe((res: any) => {
      this.wards = res.body;
      this.localities = [];
    });
  }

  // LOAD LOCALITIES
  loadLocalities(wardId: number) {
    this.service.getLocality(wardId).subscribe((res: any) => {
      this.localities = res.body;
    });
  }

  // FILTER ZONE
  filterZone(event: any) {

    this.selectedZoneId = event.target.value;

    this.selectedWardId = null;
    this.selectedLocalityId = null;

    this.loadWards(this.selectedZoneId);

    this.getAllProperty();
  }

  // FILTER WARD
  filterWard(event: any) {

    this.selectedWardId = event.target.value;

    this.selectedLocalityId = null;

    this.loadLocalities(this.selectedWardId);

    this.getAllProperty();
  }

  // FILTER LOCALITY
  filterLocality(event: any) {

    this.selectedLocalityId = event.target.value;

    this.getAllProperty();
  }

  // SEARCH
  searchProperty() {
    this.getAllProperty();
  }

  // MODAL
  openModal() {
    this.isModal = true;
  }

  closeModal() {
    this.isModal = false;
  }

  // COLUMN MENU
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
    this.showFilterPopup = false;
  }

  toggleColumn(col: any) {

    const id = col.colId || col.field;

    const column = this.gridApi.getColumn(id);

    const visible = column.isVisible();

    this.gridApi.setColumnsVisible([id], !visible);

  }

  isColumnVisible(col: any) {

    const id = col.colId || col.field;

    const column = this.gridApi.getColumn(id);

    return column ? column.isVisible() : true;

  }

  toggleFilterPopup() {
    this.showFilterPopup = !this.showFilterPopup;
  }
onRowClicked(event:any)
{
 this.router.navigate(['home/property', event.data.id]);
}
}