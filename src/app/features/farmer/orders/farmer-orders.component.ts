import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-farmer-orders',
  standalone: false,
  templateUrl: './farmer-orders.component.html',
  styleUrls: ['./farmer-orders.component.scss']
})
export class FarmerOrdersComponent implements OnInit {
  activeNav = 'orders';
  farmerName = '';
  sidebarCollapsed = false;

  orders: any[] = [];
  filteredOrders: any[] = [];
  loading = true;
  activeTab = 'all';

  tabs = [
    { key: 'all', label: 'All Orders' },
    { key: 'pending', label: 'Pending' },
    { key: 'negotiating', label: 'Negotiating' },
    { key: 'confirmed', label: 'Confirmed' },
    { key: 'delivered', label: 'Delivered' }
  ];

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
    this.loadOrders();
  }

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  loadOrders() {
    this.loading = true;
    this.http.get<any[]>(`${this.apiUrl}/orders/farmer`).subscribe({
      next: (data) => {
        this.orders = Array.isArray(data) ? data : [];
        this.filterOrders();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading orders:', err);
        this.orders = [];
        this.filteredOrders = [];
        this.loading = false;
      }
    });
  }

  setTab(tab: string) {
    this.activeTab = tab;
    this.filterOrders();
  }

  filterOrders() {
    if (this.activeTab === 'all') {
      this.filteredOrders = this.orders;
    } else {
      this.filteredOrders = this.orders.filter(o => o.status === this.activeTab);
    }
  }

  getTabCount(tab: string): number {
    if (tab === 'all') return this.orders.length;
    return this.orders.filter(o => o.status === tab).length;
  }

  updateStatus(orderId: string, newStatus: string) {
    this.http.patch(`${this.apiUrl}/orders/${orderId}/status`, { status: newStatus }).subscribe({
      next: () => this.loadOrders(),
      error: (err) => console.error('Error updating status:', err)
    });
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