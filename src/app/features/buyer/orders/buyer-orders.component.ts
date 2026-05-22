import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../core/services/auth.service';
import { environment } from '../../../../environments/environment';

@Component({
  standalone: false,
  selector: 'app-buyer-orders',
  templateUrl: './buyer-orders.component.html',
  styleUrls: ['./buyer-orders.component.scss']
})
export class BuyerOrdersComponent implements OnInit {
  orders: any[] = [];
  filteredOrders: any[] = [];
  isLoading = true;
  activeNav = 'orders';
  activeTab = 'all';
  tabs = [
    { key: 'all', label: 'All Orders' },
    { key: 'pending', label: 'Pending' },
    { key: 'confirmed', label: 'Confirmed' },
    { key: 'delivered', label: 'Delivered' }
  ];

  constructor(private http: HttpClient, private authService: AuthService, private router: Router) {}

  ngOnInit() { this.loadOrders(); }

  loadOrders() {
    this.isLoading = true;
    this.http.get<any[]>(`${environment.apiUrl}/api/buyer-orders`).subscribe({
      next: (data: any[]) => { this.orders = data; this.filterOrders(); this.isLoading = false; },
      error: (err: any) => { console.error(err); this.isLoading = false; }
    });
  }

  switchTab(tab: string) { this.activeTab = tab; this.filterOrders(); }

  filterOrders() {
    this.filteredOrders = this.activeTab === 'all' ? this.orders : this.orders.filter((o: any) => o.status === this.activeTab);
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = { pending: 'status-pending', negotiating: 'status-negotiating', confirmed: 'status-confirmed', delivered: 'status-delivered' };
    return map[status] || '';
  }

  navigate(section: string) {
    this.activeNav = section;
    if (section === 'browse') this.router.navigate(['/buyer/marketplace']);
    else if (section === 'cart') this.router.navigate(['/buyer/cart']);
    else if (section === 'messages') this.router.navigate(['/buyer/messages']);
    else this.router.navigate(['/buyer/' + section]);
  }

  logout() { this.authService.logout(); }
}