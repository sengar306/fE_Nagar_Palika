import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  baseUrl: any = environment.baseUrl;

  constructor(private http: HttpClient) {}

  login(body: any) {
    const url = `${this.baseUrl}/auth/login`;
    return this.http.post(url, body, { observe: 'response' });
  }

  setTokenData(token: any) {
    localStorage.setItem('token', token);
  }

  decodeToken(token: any) {
    return jwtDecode(token);
  }

  getTokendata() {
    const token = localStorage.getItem('token');

    if (!token) {
      return null;
    }

    try {
      return jwtDecode(token);
    } catch {
      return null;
    }
  }
}
