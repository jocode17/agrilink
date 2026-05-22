import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';

// Auth
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';

// Farmer
import { FarmerDashboardComponent } from './features/farmer/dashboard/farmer-dashboard.component';
import { FarmerProductsComponent } from './features/farmer/products/farmer-products.component';
import { FarmerOrdersComponent } from './features/farmer/orders/farmer-orders.component';
import { FarmerMessagesComponent } from './features/farmer/messages/farmer-messages.component';

// Buyer
import { BuyerMarketplaceComponent } from './features/buyer/marketplace/buyer-marketplace.component';
import { BuyerCartComponent } from './features/buyer/cart/buyer-cart.component';
import { BuyerOrdersComponent } from './features/buyer/orders/buyer-orders.component';
import { BuyerMessagesComponent } from './features/buyer/messages/buyer-messages.component';

// Admin
import { AdminPanelComponent } from './features/admin/panel/admin-panel.component';

import { AuthInterceptor } from './core/interceptors/auth.interceptor';

@NgModule({
  declarations: [
    App,
    LoginComponent,
    RegisterComponent,
    FarmerDashboardComponent,
    FarmerProductsComponent,
    FarmerOrdersComponent,
    FarmerMessagesComponent,
    BuyerMarketplaceComponent,
    BuyerCartComponent,
    BuyerOrdersComponent,
    BuyerMessagesComponent,
    AdminPanelComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [App]
})
export class AppModule { }