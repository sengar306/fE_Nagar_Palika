import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BillService {
  baseUrl: any = environment.baseUrl;

  constructor(private http: HttpClient) {}

  getAllBills() {
    const url = `${this.baseUrl}/api/bill/all`;
    return this.http.get(url, { observe: 'response' });
  }

  submitCounterPayment(body: any) {
    const url = `${this.baseUrl}/api/bill/pay`;
    return this.http.post(url, body, { observe: 'response' });
  }
}
