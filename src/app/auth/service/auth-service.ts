import { HttpBackend, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  baseUrl:any=environment.baseUrl
  constructor(private http:HttpClient){

  }
  login(body:any){
    let url=`${this.baseUrl}/auth/login`
    return this.http.post(url,body,{observe:'response'})

  }
}