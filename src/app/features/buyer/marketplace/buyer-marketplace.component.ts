import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../core/services/auth.service';
import { environment } from '../../../../environments/environment';

interface MarketProduct {
  id: string;
  name: string;
  description?: string;
  pricePerUnit: number;
  unit: string;
  stockQuantity: number;
  status: string;
  categoryName: string;
  farmName: string;
  farmerName: string;
}

interface MarketStats {
  activeFarmers: number;
  availableProducts: number;
}

@Component({
  standalone: false,
  selector: 'app-buyer-marketplace',
  templateUrl: './buyer-marketplace.component.html',
  styleUrls: ['./buyer-marketplace.component.scss']
})
export class BuyerMarketplaceComponent implements OnInit {
  products: MarketProduct[] = [];
  stats: MarketStats = { activeFarmers: 0, availableProducts: 0 };
  searchQuery = '';
  isLoading = true;
  cartCounts: Record<string, number> = {};
  activeNav = 'browse';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadStats();
    this.loadProducts();
  }

  loadStats() {
    this.http.get<MarketStats>(`${environment.apiUrl}/api/marketplace/stats`).subscribe({
      next: (data: MarketStats) => this.stats = data,
      error: (err: any) => console.error(err)
    });
  }

  loadProducts() {
    this.isLoading = true;
    let url = `${environment.apiUrl}/api/marketplace/products`;
    if (this.searchQuery) url += `?search=${this.searchQuery}`;

    this.http.get<MarketProduct[]>(url).subscribe({
      next: (data: MarketProduct[]) => {
        this.products = data;
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  onSearch() {
    this.loadProducts();
  }

  addToCart(product: MarketProduct) {
    this.http.post(`${environment.apiUrl}/api/cart`, {
      productId: product.id,
      quantity: 1
    }).subscribe({
      next: () => {
        this.cartCounts[product.id] = (this.cartCounts[product.id] || 0) + 1;
      },
      error: (err: any) => console.error(err)
    });
  }

  getEmoji(name: string): string {
    const map: Record<string, string> = {
      'Tomatoes': '🍅', 'Carrots': '🥕', 'Lettuce': '🥬', 'Kangkong': '🥬'
    };
    return map[name] || '🌿';
  }

  navigate(section: string) {
    this.activeNav = section;
    if (section === 'browse') this.router.navigate(['/buyer/marketplace']);
    else if (section === 'cart') this.router.navigate(['/buyer/cart']);
    else if (section === 'orders') this.router.navigate(['/buyer/orders']);
    else if (section === 'messages') this.router.navigate(['/buyer/messages']);
  }

  logout() {
    this.authService.logout();
  }
}