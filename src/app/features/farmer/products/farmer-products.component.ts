import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-farmer-products',
  standalone: false,
  templateUrl: './farmer-products.component.html',
  styleUrls: ['./farmer-products.component.scss']
})
export class FarmerProductsComponent implements OnInit {
  activeNav = 'products';
  farmerName = '';
  sidebarCollapsed = false;

  products: any[] = [];
  categories: any[] = [];
  loading = true;

  // Modal state
  showModal = false;
  modalMode: 'add' | 'edit' = 'add';
  editingProduct: any = null;

  // Form fields (matching Product entity exactly)
  formName = '';
  formDescription = '';
  formPricePerUnit: number = 0;
  formUnit = 'kg';
  formStock: number = 0;
  formCapacity: number | null = null;
  formLowStockThreshold: number = 10;
  formCategoryId = '';
  formImageUrl = '';
  formSeedingDate = '';
  formHarvestDate = '';
  formSaving = false;

  // Delete confirmation
  showDeleteConfirm = false;
  deletingProduct: any = null;

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
    this.loadProducts();
    this.loadCategories();
  }

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  loadProducts() {
    this.loading = true;
    this.http.get<any[]>(`${this.apiUrl}/farmer-products`).subscribe({
      next: (data) => {
        this.products = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading products:', err);
        this.loading = false;
      }
    });
  }

  loadCategories() {
    this.http.get<any[]>(`${this.apiUrl}/farmer-products/categories`).subscribe({
      next: (data) => this.categories = data,
      error: (err) => console.error('Error loading categories:', err)
    });
  }

  // ─── ADD ───────────────────────────────────────────
  openAddModal() {
    this.modalMode = 'add';
    this.editingProduct = null;
    this.resetForm();
    this.showModal = true;
  }

  // ─── EDIT ──────────────────────────────────────────
  openEditModal(product: any) {
    this.modalMode = 'edit';
    this.editingProduct = product;
    this.formName = product.name;
    this.formDescription = product.description || '';
    this.formPricePerUnit = product.pricePerUnit;
    this.formUnit = product.unit || 'kg';
    this.formStock = product.stockQuantity;
    this.formCapacity = product.capacity;
    this.formLowStockThreshold = product.lowStockThreshold || 10;
    this.formCategoryId = product.categoryId || '';
    this.formImageUrl = product.imageUrl || '';
    this.formSeedingDate = product.seedingDate || '';
    this.formHarvestDate = product.harvestDate || '';
    this.showModal = true;
  }

  // ─── SAVE (create or update) ───────────────────────
  saveProduct() {
    if (!this.formName || this.formPricePerUnit <= 0) return;
    this.formSaving = true;

    const payload: any = {
      name: this.formName,
      description: this.formDescription,
      pricePerUnit: this.formPricePerUnit,
      unit: this.formUnit,
      stockQuantity: this.formStock,
      lowStockThreshold: this.formLowStockThreshold,
      imageUrl: this.formImageUrl
    };

    if (this.formCategoryId) {
      payload.categoryId = this.formCategoryId;
    }
    if (this.formCapacity !== null && this.formCapacity > 0) {
      payload.capacity = this.formCapacity;
    }
    if (this.formSeedingDate) {
      payload.seedingDate = this.formSeedingDate;
    }
    if (this.formHarvestDate) {
      payload.harvestDate = this.formHarvestDate;
    }

    if (this.modalMode === 'add') {
      this.http.post(`${this.apiUrl}/farmer-products`, payload).subscribe({
        next: () => {
          this.showModal = false;
          this.formSaving = false;
          this.loadProducts();
        },
        error: (err) => {
          console.error('Error creating product:', err);
          this.formSaving = false;
        }
      });
    } else {
      this.http.put(`${this.apiUrl}/farmer-products/${this.editingProduct.id}`, payload).subscribe({
        next: () => {
          this.showModal = false;
          this.formSaving = false;
          this.loadProducts();
        },
        error: (err) => {
          console.error('Error updating product:', err);
          this.formSaving = false;
        }
      });
    }
  }

  // ─── DELETE ────────────────────────────────────────
  confirmDelete(product: any) {
    this.deletingProduct = product;
    this.showDeleteConfirm = true;
  }

  deleteProduct() {
    if (!this.deletingProduct) return;
    this.http.delete(`${this.apiUrl}/farmer-products/${this.deletingProduct.id}`).subscribe({
      next: () => {
        this.showDeleteConfirm = false;
        this.deletingProduct = null;
        this.loadProducts();
      },
      error: (err) => console.error('Error deleting product:', err)
    });
  }

  cancelDelete() {
    this.showDeleteConfirm = false;
    this.deletingProduct = null;
  }

  closeModal() {
    this.showModal = false;
    this.editingProduct = null;
    this.resetForm();
  }

  resetForm() {
    this.formName = '';
    this.formDescription = '';
    this.formPricePerUnit = 0;
    this.formUnit = 'kg';
    this.formStock = 0;
    this.formCapacity = null;
    this.formLowStockThreshold = 10;
    this.formCategoryId = '';
    this.formImageUrl = '';
    this.formSeedingDate = '';
    this.formHarvestDate = '';
    this.formSaving = false;
  }

  getStatusLabel(status: string): string {
    if (status === 'available') return 'Available';
    if (status === 'low_stock') return 'Low Stock';
    if (status === 'out_of_stock') return 'Out of Stock';
    return status;
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