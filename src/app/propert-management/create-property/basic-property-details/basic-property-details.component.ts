  import { CommonModule } from '@angular/common';
  import { Component, Input, OnInit } from '@angular/core';
  import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
  import { PropertyManagemnetService } from '../../property-managemnet-service';


  @Component({
    selector: 'app-basic-property-details',
    templateUrl: './basic-property-details.component.html',
    styleUrls: ['./basic-property-details.component.scss'],
    imports:[ReactiveFormsModule, CommonModule]
  })
  export class BasicPropertyDetailsComponent implements OnInit {
  roadWidth:any
  @Input()propertyForm!:FormGroup
    zones:any[]=[];
    wards:any[]=[];
    localities:any[]=[];
    isFetchingLocation = false;
    locationError = '';
  contructionType: string[] = [
   'PAKKA',
   'KACCHA' ,
     ];
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

    
      this.loadRoadWidth()
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

    async getCurrentLocation() {
      this.isFetchingLocation = true;
      this.locationError = '';

      try {
        const coordinates = await new Promise<GeolocationPosition>((resolve, reject) => {
          if (!navigator.geolocation) {
            reject(new Error('Geolocation not supported'));
            return;
          }

          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 0,
          });
        });

        this.propertyForm.patchValue({
          latitude: coordinates.coords.latitude.toFixed(6),
          longitude: coordinates.coords.longitude.toFixed(6),
        });
      } catch (error) {
        this.locationError = 'Please enable GPS and allow location access.';
      } finally {
        this.isFetchingLocation = false;
      }
    }
     loadRoadWidth(){
      this.propertyService.getRoadWidth().subscribe({
        next:(res:any)=>{
          if (res){
            this.roadWidth=res.body
          }
        }
      })

     }
       propertyCategories = [
    'Residential',
    'Commercial',
    'Mixed'
  ];
  }
