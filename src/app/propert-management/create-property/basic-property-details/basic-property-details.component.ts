  import { Component, Input, OnInit } from '@angular/core';
  import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
  import { PropertyManagemnetService } from '../../property-managemnet-service';


  @Component({
    selector: 'app-basic-property-details',
    templateUrl: './basic-property-details.component.html',
    styleUrls: ['./basic-property-details.component.scss'],
    imports:[ReactiveFormsModule]
  })
  export class BasicPropertyDetailsComponent implements OnInit {


  @Input()propertyForm!:FormGroup
    zones:any[]=[];
    wards:any[]=[];
    localities:any[]=[];

    ownerships = [
    'Owner' ,
    'Occupy' 
    ];

    genders = [
      { id: 1, name: 'Male' },
      { id: 2, name: 'Female' },
      { id: 3, name: 'Other' }
    ];

    constructor(
      private fb:FormBuilder,
      private propertyService:PropertyManagemnetService
    ){}

    ngOnInit(){

    

      this.loadZones();

  // Zone change
  this.propertyForm.get('zone')?.valueChanges.subscribe((zone:any)=>{
   console.log(zone)
      this.loadWards(zone.id);
    
  });

  // Ward change
  this.propertyForm.get('ward')?.valueChanges.subscribe((ward:any)=>{

    if(ward && ward.id){
      this.loadLocalities(ward.id);
    }

  });

    }

    loadZones(){
    
      this.propertyService.getZones().subscribe((res:any)=>{
        this.zones = res.body;
          console.log(this.zones)   
      });
    }

    loadWards(zoneId:number){
      this.propertyService.getWard(zoneId).subscribe((res:any)=>{
        this.wards = res.body;
        this.localities=[];
        this.propertyForm.patchValue({ward:null,locality:null});
      });
    }

    loadLocalities(wardId:number){
      this.propertyService.getLocality(wardId).subscribe((res:any)=>{
        this.localities = res.body;
      });
    }

  }