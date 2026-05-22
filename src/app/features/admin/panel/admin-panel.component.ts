import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../core/services/auth.service';
import { environment } from '../../../../environments/environment';

@Component({
  standalone: false,
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss']
})
export class AdminPanelComponent implements OnInit {
  activeTab = 'products';
  products: any[] = [];
  notifications: any[] = [];
  stats: any = {};
  farmers: any[] = [];
  categories: any[] = [];
  isLoading = true;

  // Add product form
  showAddForm = false;
  newProduct: any = { name: '', description: '', pricePerUnit: 0, unit: 'kg', stockQuantity: 0, capacity: 0, lowStockThreshold: 10, farmId: '', categoryId: '' };

  constructor(private http: HttpClient, private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.loadStats();
    this.loadProducts();
    this.loadNotifications();
    this.loadFarmers();
    this.loadCategories();
  }

  loadStats() {
    this.http.get<any>(`${environment.apiUrl}/api/admin/stats`).subscribe({
      next: (data: any) => this.stats = data,
      error: (err: any) => console.error(err)
    });
  }

  loadProducts() {
    this.isLoading = true;
    this.http.get<any[]>(`${environment.apiUrl}/api/admin/products`).subscribe({
      next: (data: any[]) => { this.products = data; this.isLoading = false; },
      error: (err: any) => { console.error(err); this.isLoading = false; }
    });
  }

  loadNotifications() {
    this.http.get<any[]>(`${environment.apiUrl}/api/admin/notifications`).subscribe({
      next: (data: any[]) => this.notifications = data,
      error: (err: any) => console.error(err)
    });
  }

  loadFarmers() {
    this.http.get<any[]>(`${environment.apiUrl}/api/admin/farmers`).subscribe({
      next: (data: any[]) => this.farmers = data,
      error: (err: any) => console.error(err)
    });
  }

  loadCategories() {
    this.http.get<any[]>(`${environment.apiUrl}/api/admin/categories`).subscribe({
      next: (data: any[]) => this.categories = data,
      error: (err: any) => console.error(err)
    });
  }

  toggleAddForm() { this.showAddForm = !this.showAddForm; }

  createProduct() {
    if (!this.newProduct.name || !this.newProduct.farmId || !this.newProduct.categoryId) return;
    this.http.post(`${environment.apiUrl}/api/admin/products`, this.newProduct).subscribe({
      next: () => {
        this.showAddForm = false;
        this.newProduct = { name: '', description: '', pricePerUnit: 0, unit: 'kg', stockQuantity: 0, capacity: 0, lowStockThreshold: 10, farmId: '', categoryId: '' };
        this.loadProducts();
        this.loadStats();
      },
      error: (err: any) => console.error(err)
    });
  }

  toggleProduct(product: any) {
    this.http.put(`${environment.apiUrl}/api/admin/products/${product.id}`, { isActive: !product.isActive }).subscribe({
      next: () => this.loadProducts(),
      error: (err: any) => console.error(err)
    });
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = { available: 'st-available', low_stock: 'st-low', out_of_stock: 'st-out' };
    return map[status] || '';
  }

  logout() { this.authService.logout(); }
}