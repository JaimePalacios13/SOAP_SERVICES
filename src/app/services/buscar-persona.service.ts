import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SoapService {
  private baseUrl = 'https://www.crcind.com/csp/samples/SOAP.Demo.cls';

  constructor(private http: HttpClient) {}

  consultarInfoPersona(id: number): Observable<any> {
    const url = `/api?soap_method=FindPerson&id=${id}`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.get(url, { headers, responseType: 'text' });
  }
}
