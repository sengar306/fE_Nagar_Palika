import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PropertyManagemnetService {
    


  baseUrl:any=environment.baseUrl
  constructor(private http:HttpClient){

  }
  getZones()
  {
    let url=`${this.baseUrl}/api/master/zones`
    return this.http.get(url,{observe:'response'})
  }
  getWard(zone:number){
     let url=`${this.baseUrl}/api/master/wards?zoneId=${zone}`
    return this.http.get(url,{observe:'response'})
  
  }
  getLocality(ward:number){
       let url=`${this.baseUrl}/api/master/localities?wardId=${ward}`
    return this.http.get(url,{observe:'response'})
  }
  createPropety(body:any){
    let url = `${this.baseUrl}/api/property/create`
   return this.http.post(url,body,{observe:'response'})

  }
  getAllProperty(){
    let url=`${this.baseUrl}/api/property/get_all_property`
      return this.http.get(url,{observe:'response'})
  }
}
