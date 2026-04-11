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
updateProperty(propertyId: number | string, body: any) {
  const url = `${this.baseUrl}/api/property/update/${propertyId}`;
  return this.http.put(url, body, { observe: 'response' });
}
getAllProperty(params:any){
      let url = `${this.baseUrl}/api/property/get_all_property`
  return this.http.get(url, {
    params: params,
    observe: 'response'
  });
}
getPropetyById(id:any){
let url=`${this.baseUrl}/api/property/byid?id=${id}`
  return this.http.get(url,{observe:'response'})

}

uploadPropertyPhoto(file: Blob, fileName: string, propertyId?: string | number | null) {
  const formData = new FormData();
  formData.append('file', file, fileName);

  if (propertyId !== null && propertyId !== undefined && propertyId !== '') {
    formData.append('propertyId', String(propertyId));
  }

  const url = `${this.baseUrl}/api/property/upload-photo`;
  return this.http.post(url, formData, { observe: 'response' });
}
getRoadWidth(){
  let url=`${this.baseUrl}/api/master/loadRoadWidth`
  return this.http.get(url,{observe:'response'})
}

createBill(propertyId:number){
  let url=`${this.baseUrl}/api/bill/generate/${propertyId}`
 return this.http.post(url, {}, {observe:'response'})
}
}
