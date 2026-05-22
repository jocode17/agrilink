import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../core/services/auth.service';
import { environment } from '../../../../environments/environment';

interface CartItemData {
  id: string; productId: string; productName: string; pricePerUnit: number;
  unit: string; quantity: number; subtotal: number; farmName: string; farmerId: string;
}

@Component({
  standalone: false,
  selector: 'app-buyer-cart',
  templateUrl: './buyer-cart.component.html',
  styleUrls: ['./buyer-cart.component.scss']
})
export class BuyerCartComponent implements OnInit {
  cartItems: CartItemData[] = [];
  isLoading = true;
  activeNav = 'cart';
  selectedPayment = 'gcash';
  isCheckingOut = false;

  constructor(private http: HttpClient, private authService: AuthService, private router: Router) {}

  ngOnInit() { this.loadCart(); }

  loadCart() {
    this.isLoading = true;
    this.http.get<CartItemData[]>(`${environment.apiUrl}/api/cart`).subscribe({
      next: (data: CartItemData[]) => { this.cartItems = data; this.isLoading = false; },
      error: (err: any) => { console.error(err); this.isLoading = false; }
    });
  }

  get cartTotal(): number { return this.cartItems.reduce((sum, item) => sum + item.subtotal, 0); }

  updateQuantity(item: CartItemData, delta: number) {
    const newQty = item.quantity + delta;
    if (newQty <= 0) { this.removeItem(item); return; }
    this.http.put(`${environment.apiUrl}/api/cart/${item.id}`, { quantity: newQty }).subscribe({ next: () => this.loadCart() });
  }

  removeItem(item: CartItemData) {
    this.http.delete(`${environment.apiUrl}/api/cart/${item.id}`).subscribe({ next: () => this.loadCart() });
  }

  checkout() {
    if (this.cartItems.length === 0) return;
    this.isCheckingOut = true;
    this.http.post(`${environment.apiUrl}/api/buyer-orders/checkout`, {
      paymentMethod: this.selectedPayment
    }).subscribe({
      next: () => {
        this.isCheckingOut = false;
        alert('Order placed successfully!');
        this.router.navigate(['/buyer/orders']);
      },
      error: (err: any) => { this.isCheckingOut = false; console.error(err); }
    });
  }

  getEmoji(name: string): string {
    const map: Record<string, string> = { 'Tomatoes': '🍅', 'Carrots': '🥕', 'Lettuce': '🥬', 'Kangkong': '🥬' };
    return map[name] || '🌿';
  }

  navigate(section: string) {
    if (section === 'browse') this.router.navigate(['/buyer/marketplace']);
    else if (section === 'cart') this.router.navigate(['/buyer/cart']);
    else if (section === 'messages') this.router.navigate(['/buyer/messages']);
    else this.router.navigate(['/buyer/' + section]);
  }

  logout() { this.authService.logout(); }
}