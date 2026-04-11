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
      if (zone?.id) {
        this.loadWards(zone.id);
      }
    
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
        this.restoreLocationSelections();
      });
    }

    loadWards(zoneId:number){
      this.propertyService.getWard(zoneId).subscribe((res:any)=>{
        this.wards = res.body;
        const selectedWardId = this.propertyForm.get('ward')?.value?.id;
        const matchedWard = this.wards.find((ward: any) => ward.id === selectedWardId) || null;

        this.propertyForm.patchValue({ ward: matchedWard }, { emitEvent: false });

        if (matchedWard?.id) {
          this.loadLocalities(matchedWard.id);
        } else {
          this.localities = [];
          this.propertyForm.patchValue({ locality: null }, { emitEvent: false });
        }
      });
    }

    loadLocalities(wardId:number){
      this.propertyService.getLocality(wardId).subscribe((res:any)=>{
        this.localities = res.body;
        const selectedLocalityId = this.propertyForm.get('locality')?.value?.id;
        const matchedLocality =
          this.localities.find((locality: any) => locality.id === selectedLocalityId) || null;

        this.propertyForm.patchValue({ locality: matchedLocality }, { emitEvent: false });
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
            const selectedRoadWidthId = this.propertyForm.get('roadWidth')?.value?.id;
            const matchedRoadWidth =
              this.roadWidth.find((item: any) => item.id === selectedRoadWidthId) || null;

            if (matchedRoadWidth) {
              this.propertyForm.patchValue({ roadWidth: matchedRoadWidth }, { emitEvent: false });
            }
          }
        }
      })

     }
  propertyCategories = [
    'Residential',
    'Commercial',
    'Mixed'
  ];

  private restoreLocationSelections() {
    const selectedZoneId = this.propertyForm.get('zone')?.value?.id;
    const matchedZone = this.zones.find((zone: any) => zone.id === selectedZoneId) || null;

    if (!matchedZone) {
      return;
    }

    this.propertyForm.patchValue({ zone: matchedZone }, { emitEvent: false });
    this.loadWards(matchedZone.id);
  }
  }
