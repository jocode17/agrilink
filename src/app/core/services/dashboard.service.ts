import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface DashboardOverview {
  totalRevenue: number;
  activeOrders: number;
  totalBuyers: number;
  growthRate: number;
  totalProducts: number;
}

export interface SupplyTrendItem {
  cropName: string;
  month: string;
  totalHarvested: number;
}

export interface ConsumerDemandItem {
  buyerType: string;
  orderCount: number;
  percentage: number;
}

export interface CropAvailabilityItem {
  productName: string;
  currentStock: number;
  capacity: number;
}

export interface DashboardData {
  overview: DashboardOverview;
  supplyTrends: SupplyTrendItem[];
  consumerDemand: ConsumerDemandItem[];
  cropAvailability: CropAvailabilityItem[];
}

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private apiUrl = `${environment.apiUrl}/api/dashboard`;

  constructor(private http: HttpClient) {}

  getFarmerDashboard(): Observable<DashboardData> {
    return this.http.get<DashboardData>(`${this.apiUrl}/farmer`);
  }
}