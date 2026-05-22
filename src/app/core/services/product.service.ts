import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'https://localhost:7070/api';

  constructor(private http: HttpClient) {}

  // Farmer's own products
  getMyProducts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/farmer-products`);
  }

  getProduct(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/farmer-products/${id}`);
  }

  createProduct(product: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/farmer-products`, product);
  }

  updateProduct(id: string, product: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/farmer-products/${id}`, product);
  }

  deleteProduct(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/farmer-products/${id}`);
  }

  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/farmer-products/categories`);
  }
}