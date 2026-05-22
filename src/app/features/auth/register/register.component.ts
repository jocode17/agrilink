import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  standalone: false,
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  activeTab: 'farmer' | 'buyer' = 'farmer';
  errorMessage = '';
  isLoading = false;

  // Farmer fields
  farmName = '';
  ownerName = '';
  farmerEmail = '';
  farmerPassword = '';
  farmerRetypePassword = '';
  farmerPhone = '';
  farmerAddress = '';
  farmDescription = '';

  // Buyer fields
  buyerFullName = '';
  buyerEmail = '';
  buyerPassword = '';
  buyerRetypePassword = '';
  buyerType = '';
  buyerPhone = '';
  buyerDeliveryAddress = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  switchTab(tab: 'farmer' | 'buyer') {
    this.activeTab = tab;
    this.errorMessage = '';
  }

  onRegisterFarmer() {
    if (!this.farmName || !this.ownerName || !this.farmerEmail || !this.farmerPassword || !this.farmerPhone || !this.farmerAddress) {
      this.errorMessage = 'Please fill in all required fields';
      return;
    }
    if (this.farmerPassword !== this.farmerRetypePassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }
    if (this.farmerPassword.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.registerFarmer({
      email: this.farmerEmail,
      password: this.farmerPassword,
      farmName: this.farmName,
      ownerName: this.ownerName,
      phoneNumber: this.farmerPhone,
      address: this.farmerAddress,
      farmDescription: this.farmDescription || undefined
    }).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/farmer/dashboard']);
      },
      error: (err: any) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Registration failed. Please try again.';
      }
    });
  }

  onRegisterBuyer() {
    if (!this.buyerFullName || !this.buyerEmail || !this.buyerPassword || !this.buyerType || !this.buyerPhone || !this.buyerDeliveryAddress) {
      this.errorMessage = 'Please fill in all required fields';
      return;
    }
    if (this.buyerPassword !== this.buyerRetypePassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.registerBuyer({
      email: this.buyerEmail,
      password: this.buyerPassword,
      fullName: this.buyerFullName,
      phoneNumber: this.buyerPhone,
      buyerType: this.buyerType,
      deliveryAddress: this.buyerDeliveryAddress
    }).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/buyer/marketplace']);
      },
      error: (err: any) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Registration failed. Please try again.';
      }
    });
  }
}