import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-farmer-dashboard',
  standalone: false,
  templateUrl: './farmer-dashboard.component.html',
  styleUrls: ['./farmer-dashboard.component.scss']
})
export class FarmerDashboardComponent implements OnInit {
  activeNav = 'overview';
  farmerName = '';
  sidebarCollapsed = false;

  // Dashboard stats
  totalProducts = 0;
  totalOrders = 0;
  totalRevenue = 0;
  pendingOrders = 0;
  growthRate = 0;

  recentOrders: any[] = [];
  topProducts: any[] = [];
  loading = true;

  // Harvest Analytics
  supplyData: any[] = [];
  demandData: any[] = [];
  cropAvailability: any[] = [];

  private apiUrl = 'https://localhost:7070/api';

  constructor(
    private router: Router,
    private http: HttpClient,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const user: any = this.authService.currentUser;
    if (user) {
      this.farmerName = user.farmName || user.ownerName || user.email || 'Farmer';
    }
    this.loadDashboard();
  }

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  loadDashboard() {
    this.loading = true;

    // Load farmer stats
    this.http.get<any>(`${this.apiUrl}/farmer/stats`).subscribe({
      next: (data) => {
        this.totalProducts = data.totalProducts || 0;
        this.totalOrders = data.totalOrders || 0;
        this.totalRevenue = data.totalRevenue || 0;
        this.pendingOrders = data.pendingOrders || 0;
        this.growthRate = data.growthRate || 0;
      },
      error: () => {}
    });

    // Load recent orders
    this.http.get<any[]>(`${this.apiUrl}/orders?pageSize=5`).subscribe({
      next: (data) => {
        this.recentOrders = Array.isArray(data) ? data.slice(0, 5) : [];
      },
      error: () => { this.recentOrders = []; }
    });

    // Load products for top products + crop availability
    this.http.get<any[]>(`${this.apiUrl}/farmer-products`).subscribe({
      next: (data) => {
        this.topProducts = Array.isArray(data) ? data.slice(0, 4) : [];
        this.buildAnalyticsFromProducts(data || []);
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });

    // Load harvest analytics if endpoint exists
    this.http.get<any>(`${this.apiUrl}/farmer/analytics`).subscribe({
      next: (data) => {
        if (data) {
          this.supplyData = data.supplyTrends || this.supplyData;
          this.demandData = data.demandBreakdown || this.demandData;
        }
      },
      error: () => {
        // Use product-based analytics as fallback (already built above)
      }
    });
  }

  buildAnalyticsFromProducts(products: any[]) {
    // Build crop availability from products
    this.cropAvailability = products.slice(0, 6).map(p => ({
      name: p.name,
      stock: p.stockQuantity,
      capacity: p.capacity || p.stockQuantity * 1.5,
      status: p.status,
      unit: p.unit
    }));

    // Build simple supply data from products
    if (this.supplyData.length === 0) {
      this.supplyData = products.slice(0, 5).map(p => ({
        name: p.name,
        value: p.stockQuantity
      }));
    }
  }

  getStockPercentage(item: any): number {
    if (!item.capacity || item.capacity <= 0) return 50;
    return Math.min(100, Math.round((item.stock / item.capacity) * 100));
  }

  getStockBarClass(item: any): string {
    const pct = this.getStockPercentage(item);
    if (pct > 60) return 'bar-good';
    if (pct > 25) return 'bar-low';
    return 'bar-critical';
  }

  getMaxSupply(): number {
    if (this.supplyData.length === 0) return 1;
    return Math.max(...this.supplyData.map(s => s.value), 1);
  }

  getBarHeight(value: number): number {
    return Math.max(5, (value / this.getMaxSupply()) * 100);
  }

  navigate(section: string) {
    this.activeNav = section;
    if (section === 'overview') {
      this.router.navigate(['/farmer/dashboard']);
    } else {
      this.router.navigate(['/farmer/' + section]);
    }
  }

  logout() {
    this.authService.logout();
  }
}