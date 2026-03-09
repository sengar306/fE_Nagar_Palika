import { Component, OnInit } from '@angular/core';
import { CreatePropertyComponent } from "./create-property/create-property.component";
import { CommonModule } from '@angular/common';
import { PropertyManagemnetService } from './property-managemnet-service';
import { AgGridAngular, AgGridModule } from 'ag-grid-angular';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';

ModuleRegistry.registerModules([AllCommunityModule]);
@Component({
  selector: 'app-propert-management',
  templateUrl: './propert-management.component.html',
  styleUrls: ['./propert-management.component.scss'],
  imports: [CreatePropertyComponent,CommonModule,AgGridModule],
})
export class PropertManagementComponent  implements OnInit {

  constructor(private service:PropertyManagemnetService) { }

  ngOnInit() {
  this.getAllProperty()
  }
isModal = false;

openModal() {
  this.isModal = true;
}
  rowData:any

    // Column Definitions: Defines the columns to be displayed.
  colDefs = [
  { headerName: 'ID', field: 'id' },
  { headerName: 'Zone ID', field: 'zone.id' },
  { headerName: 'Zone Name', field: 'zone.name' },
  { headerName: 'Ward ID', field: 'ward.id' },
  { headerName: 'Ward Name', field: 'ward.name' },
  { headerName: 'Ward Zone ID', field: 'ward.zone.id' },
  { headerName: 'Ward Zone Name', field: 'ward.zone.name' },
  { headerName: 'Locality', field: 'locality' }, // null ho sakta hai
  { headerName: 'PTIN', field: 'ptin' },
  { headerName: 'Ownership', field: 'ownership' },
  { headerName: 'Owner Name', field: 'ownerName' },
  { headerName: 'Father Name', field: 'fatherName' },
  { headerName: 'Mobile No', field: 'mobileNo' },
  { headerName: 'Gender', field: 'gender' },
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

closeModal() {
  this.isModal = false;
}
getAllProperty(){
this.service.getAllProperty().subscribe({
  next:(res:any)=>{
this.rowData=res.body
  }
})

  
}
}
