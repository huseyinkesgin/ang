// src/app/services/city.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { City } from '../interfaces/city.interface';

@Injectable({
  providedIn: 'root'
})
export class CityService {
  private apiUrl = 'http://localhost:8000/api/cities';

  constructor(private http: HttpClient) {}

  getCities(sortField?: string, sortDirection?: 'asc' | 'desc'): Observable<City[]> {
    let params = new HttpParams();
    
    if (sortField && sortDirection) {
      params = params
        .set('sort_field', sortField)
        .set('sort_direction', sortDirection);
    }

    return this.http.get<City[]>(this.apiUrl, { params });
  }
}