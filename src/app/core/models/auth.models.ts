// Auth interfaces matching the C# DTOs

export interface LoginRequest {
    email: string;
    password: string;
  }
  
  export interface RegisterFarmerRequest {
    email: string;
    password: string;
    farmName: string;
    ownerName: string;
    phoneNumber: string;
    address: string;
    farmDescription?: string;
  }
  
  export interface RegisterBuyerRequest {
    email: string;
    password: string;
    fullName: string;
    phoneNumber: string;
    buyerType: string;
    deliveryAddress: string;
  }
  
  export interface AuthResponse {
    token: string;
    user: User;
  }
  
  export interface User {
    id: string;
    email: string;
    role: 'admin' | 'farmer' | 'buyer';
    phoneNumber?: string;
    isVerified: boolean;
    profile?: FarmerProfile | BuyerProfile;
  }
  
  export interface FarmerProfile {
    id: string;
    farmName: string;
    ownerName: string;
    farmDescription?: string;
    address: string;
    latitude?: number;
    longitude?: number;
    isVerified: boolean;
  }
  
  export interface BuyerProfile {
    id: string;
    fullName: string;
    buyerType: string;
    deliveryAddress?: string;
    isPermitVerified: boolean;
  }