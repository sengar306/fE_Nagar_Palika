import { Component, OnInit } from '@angular/core';
import { CreatePropertyComponent } from "./create-property/create-property.component";
import { CommonModule } from '@angular/common';
import { PropertyManagemnetService } from './property-managemnet-service';
import { AgGridAngular, AgGridModule } from 'ag-grid-angular';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';

ModuleRegistry.registerModules([AllCommunityModule]);
import { Camera, Heart, Github, Eye, EyeOff } from 'angular-feather/icons';
import { FeatherModule } from 'angular-feather';
import { IconsModule } from 'src/icons/icons-module';
import { ClickOutsideDirective } from '../directive/click-outside';
const icons = {
 Eye
};
@Component({
  selector: 'app-propert-management',
  templateUrl: './propert-management.component.html',
  styleUrls: ['./propert-management.component.scss'],
  imports: [CreatePropertyComponent,CommonModule,AgGridModule,IconsModule,ClickOutsideDirective ],

})
export class PropertManagementComponent  implements OnInit {
  zones: any;
  wards: any;
  localities!: any[];

  constructor(private service:PropertyManagemnetService) { }


  ngOnInit() {
  this.getAllProperty()
  this.loadZones()
  
  }
isModal = false;

openModal() {
  this.isModal = true;
}
  rowData:any

    // Column Definitions: Defines the columns to be displayed.
  colDefs = [

  { headerName: 'Zone Name', field: 'zone.name',hide:true },
  { headerName: 'Ward Name', field: 'ward.name' },
  { headerName: 'Locality', field: 'locality.name' }, // null ho sakta hai
  { headerName: 'PTIN', field: 'ptin' },
  { headerName: 'Ownership', field: 'ownership' },
  { headerName: 'Owner Name', field: 'ownerName',hide:true },
  { headerName: 'Father Name', field: 'fatherName',hide:true },
  { headerName: 'Mobile No', field: 'mobileNo',hide:true },
  { headerName: 'Gender', field: 'gender',hide:true  },
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
showColumnDropdown = false;

toggleDropdown() {
  this.showColumnDropdown = !this.showColumnDropdown;
}
// showColumnDropdown = false
showActionMenu = false

toggleColumnMenu(){
  this.showColumnDropdown = !this.showColumnDropdown
  this.showActionMenu = false
}

toggleActionMenu(){
  this.showActionMenu = !this.showActionMenu
  this.showColumnDropdown = false
}

closeMenus(){
  this.showColumnDropdown = false
  this.showActionMenu = false
  this.showFilterPopup=false
}
toggleColumn(col:any){

  const id = col.colId || col.field

  const column = this.gridApi.getColumn(id)

  const visible = column.isVisible()

  this.gridApi.setColumnsVisible([id], !visible)

} 
gridApi:any;
columnApi: any;

onGridReady(params: any) {
  this.gridApi = params.api;
  this.columnApi = params.columnApi;
}
isColumnVisible(col:any){

  const id = col.colId || col.field

  const column = this.gridApi.getColumn(id)

  return column ? column.isVisible() : true

}
  loadZones(){
    
      this.service.getZones().subscribe((res:any)=>{
        this.zones = res.body;
          console.log(this.zones)   
      });
    }

    loadWards(zoneId:number){
      this.service.getWard(zoneId).subscribe((res:any)=>{
        this.wards = res.body;
        this.localities=[];
       
      });
    }

    loadLocalities(wardId:number){
      this.service.getLocality(wardId).subscribe((res:any)=>{
        this.localities = res.body;
      });
    }
    showFilterPopup = false;

toggleFilterPopup(){
  this.showFilterPopup = !this.showFilterPopup
}
filterZone(event: any) {
  this.loadWards(event.target.value)
  // const zone = event.target.value;

  // // agar empty select ho jaye to filter remove
  // if (!zone) {
  //   this.gridApi.setFilterModel(null);
  //   return;
  // }

  // this.gridApi.setFilterModel({
  //   'zone.name': {
  //     type: 'contains',
  //     filter: zone
  //   }
  // });

}
filterWard(event:any){
  this.loadLocalities(event.target.value)
}


}
