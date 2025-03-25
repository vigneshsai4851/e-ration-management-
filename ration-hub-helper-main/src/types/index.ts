
// User types
export type UserRole = 'admin' | 'shopkeeper' | 'customer';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // Changed from optional to required
  role: UserRole;
  smartCardNumber?: string;
  city?: string;
  contactNumber?: string;
  aadharNumber?: string;
  createdAt: string;
}

// Product types
export interface Product {
  id: string;
  name: string;
  mrp: number;
  quantity: number;
  unit: string;
  image?: string;
  createdAt: string;
}

// Assignment types
export interface ProductAssignment {
  id: string;
  productId: string;
  productName: string;
  userId: string;
  userName: string;
  assignedBy: string;
  assignedByName: string;
  quantity: number;
  createdAt: string;
}

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
  role: UserRole;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  smartCardNumber?: string;
  contactNumber?: string;
  city?: string;
}
