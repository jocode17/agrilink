import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  standalone: false,
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  activeTab: 'farmer' | 'buyer' = 'farmer';
  email = '';
  password = '';
  errorMessage = '';
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    if (this.authService.isLoggedIn) {
      this.redirectToDashboard();
    }
  }

  switchTab(tab: 'farmer' | 'buyer') {
    this.activeTab = tab;
    this.errorMessage = '';
  }

  onSubmit() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Please fill in all fields';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: () => {
        this.isLoading = false;
        this.redirectToDashboard();
      },
      error: (err: any) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Login failed. Please try again.';
      }
    });
  }

  private redirectToDashboard() {
    const role = this.authService.currentUser?.role;
    if (role === 'farmer') {
      this.router.navigate(['/farmer/dashboard']);
    } else if (role === 'buyer') {
      this.router.navigate(['/buyer/marketplace']);
    } else if (role === 'admin') {
      this.router.navigate(['/admin']);
    }
  }
}