import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { FarmerDashboardComponent } from './features/farmer/dashboard/farmer-dashboard.component';
import { FarmerProductsComponent } from './features/farmer/products/farmer-products.component';
import { FarmerOrdersComponent } from './features/farmer/orders/farmer-orders.component';
import { FarmerMessagesComponent } from './features/farmer/messages/farmer-messages.component';
import { BuyerMarketplaceComponent } from './features/buyer/marketplace/buyer-marketplace.component';
import { BuyerCartComponent } from './features/buyer/cart/buyer-cart.component';
import { BuyerOrdersComponent } from './features/buyer/orders/buyer-orders.component';
import { BuyerMessagesComponent } from './features/buyer/messages/buyer-messages.component';
import { AdminPanelComponent } from './features/admin/panel/admin-panel.component';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // Farmer routes
  { path: 'farmer/dashboard', component: FarmerDashboardComponent, canActivate: [AuthGuard] },
  { path: 'farmer/products', component: FarmerProductsComponent, canActivate: [AuthGuard] },
  { path: 'farmer/orders', component: FarmerOrdersComponent, canActivate: [AuthGuard] },
  { path: 'farmer/messages', component: FarmerMessagesComponent, canActivate: [AuthGuard] },

  // Buyer routes
  { path: 'buyer/marketplace', component: BuyerMarketplaceComponent, canActivate: [AuthGuard] },
  { path: 'buyer/cart', component: BuyerCartComponent, canActivate: [AuthGuard] },
  { path: 'buyer/orders', component: BuyerOrdersComponent, canActivate: [AuthGuard] },
  { path: 'buyer/messages', component: BuyerMessagesComponent, canActivate: [AuthGuard] },

  // Admin route
  { path: 'admin', component: AdminPanelComponent, canActivate: [AuthGuard] },
  { path: 'admin/panel', redirectTo: '/admin', pathMatch: 'full' },

  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }